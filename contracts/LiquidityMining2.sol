// SPDX-License-Identifier: MIT

pragma solidity ^0.6.12;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/math/SafeMath.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/SafeERC20.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

contract LiquidityMining2 is Ownable, ReentrancyGuard {
    using SafeMath for uint256;
    using SafeMath for uint8;
    using SafeERC20 for ERC20;

    ERC20 public immutable usdc;
    ERC20 public immutable usdt;
    ERC20 public immutable dai;
    ERC20 public immutable sarco;

    uint256 public totalStakers;
    uint256 public totalRewards;
    uint256 public totalClaimedRewards;
    uint256 public startTime;
    uint256 public firstStakeTime;
    uint256 public endTime;

    uint256 private _totalStakeUsdc;
    uint256 private _totalStakeUsdt;
    uint256 private _totalStakeDai;
    uint256 private _totalWeight;
    uint256 private _mostRecentValueCalcTime;

    mapping(address => uint256) public userClaimedRewards;

    mapping(address => uint256) private _userStakedUsdc;
    mapping(address => uint256) private _userStakedUsdt;
    mapping(address => uint256) private _userStakedDai;
    mapping(address => uint256) private _userWeighted;
    mapping(address => uint256) private _userAccumulated;

    event Deposit(uint256 totalRewards, uint256 startTime, uint256 endTime);
    event Stake(
        address indexed staker,
        uint256 usdcIn,
        uint256 usdtIn,
        uint256 daiIn
    );
    event Payout(address indexed staker, uint256 reward, address to);
    event Withdraw(
        address indexed staker,
        uint256 usdcOut,
        uint256 usdtOut,
        uint256 daiOut,
        address to
    );

    constructor(
        address _usdc,
        address _usdt,
        address _dai,
        address _sarco,
        address owner
    ) public {
        usdc = ERC20(_usdc);
        usdt = ERC20(_usdt);
        dai = ERC20(_dai);
        sarco = ERC20(_sarco);

        transferOwnership(owner);
    }

    function totalStakeUsdc() public view returns (uint256 totalUsdc) {
        totalUsdc = denormalize(usdc, _totalStakeUsdc);
    }

    function totalStakeUsdt() public view returns (uint256 totalUsdt) {
        totalUsdt = denormalize(usdt, _totalStakeUsdt);
    }

    function totalStakeDai() public view returns (uint256 totalDai) {
        totalDai = denormalize(dai, _totalStakeDai);
    }

    function userStakeUsdc(address user)
        public
        view
        returns (uint256 usdcStake)
    {
        usdcStake = denormalize(usdc, _userStakedUsdc[user]);
    }

    function userStakeUsdt(address user)
        public
        view
        returns (uint256 usdtStake)
    {
        usdtStake = denormalize(usdt, _userStakedUsdt[user]);
    }

    function userStakeDai(address user) public view returns (uint256 daiStake) {
        daiStake = denormalize(dai, _userStakedDai[user]);
    }

    function deposit(
        uint256 _totalRewards,
        uint256 _startTime,
        uint256 _endTime
    ) public onlyOwner {
        require(
            startTime == 0,
            "LiquidityMining::deposit: already received deposit"
        );

        require(
            _startTime >= block.timestamp,
            "LiquidityMining::deposit: start time must be in future"
        );

        require(
            _endTime > _startTime,
            "LiquidityMining::deposit: end time must after start time"
        );

        require(
            sarco.balanceOf(address(this)) == _totalRewards,
            "LiquidityMining::deposit: contract balance does not equal expected _totalRewards"
        );

        totalRewards = _totalRewards;
        startTime = _startTime;
        endTime = _endTime;

        emit Deposit(_totalRewards, _startTime, _endTime);
    }

    function totalStake() public view returns (uint256 total) {
        total = _totalStakeUsdc.add(_totalStakeUsdt).add(_totalStakeDai);
    }

    function totalUserStake(address user) public view returns (uint256 total) {
        total = _userStakedUsdc[user].add(_userStakedUsdt[user]).add(
            _userStakedDai[user]
        );
    }

    modifier update() {
        if (_mostRecentValueCalcTime == 0) {
            _mostRecentValueCalcTime = firstStakeTime;
        }

        uint256 totalCurrentStake = totalStake();

        if (totalCurrentStake > 0 && _mostRecentValueCalcTime < endTime) {
            uint256 value = 0;
            uint256 sinceLastCalc = block.timestamp.sub(
                _mostRecentValueCalcTime
            );
            uint256 perSecondReward = totalRewards.div(
                endTime.sub(firstStakeTime)
            );

            if (block.timestamp < endTime) {
                value = sinceLastCalc.mul(perSecondReward);
            } else {
                uint256 sinceEndTime = block.timestamp.sub(endTime);
                value = (sinceLastCalc.sub(sinceEndTime)).mul(perSecondReward);
            }

            _totalWeight = _totalWeight.add(
                value.mul(10**18).div(totalCurrentStake)
            );

            _mostRecentValueCalcTime = block.timestamp;
        }

        _;
    }

    function shift(ERC20 token) private view returns (uint8 shifted) {
        uint8 decimals = token.decimals();
        shifted = uint8(uint8(18).sub(decimals));
    }

    function normalize(ERC20 token, uint256 tokenIn)
        private
        view
        returns (uint256 normalized)
    {
        uint8 _shift = shift(token);
        normalized = tokenIn.mul(10**uint256(_shift));
    }

    function denormalize(ERC20 token, uint256 tokenIn)
        private
        view
        returns (uint256 denormalized)
    {
        uint8 _shift = shift(token);
        denormalized = tokenIn.div(10**uint256(_shift));
    }

    function stake(
        uint256 usdcIn,
        uint256 usdtIn,
        uint256 daiIn
    ) public update nonReentrant {
        require(
            usdcIn > 0 || usdtIn > 0 || daiIn > 0,
            "LiquidityMining::stake: missing stablecoin"
        );
        require(
            block.timestamp >= startTime,
            "LiquidityMining::stake: staking isn't live yet"
        );
        require(
            sarco.balanceOf(address(this)) > 0,
            "LiquidityMining::stake: no sarco balance"
        );

        if (firstStakeTime == 0) {
            firstStakeTime = block.timestamp;
        } else {
            require(
                block.timestamp < endTime,
                "LiquidityMining::stake: staking is over"
            );
        }

        if (usdcIn > 0) {
            usdc.safeTransferFrom(msg.sender, address(this), usdcIn);
        }

        if (usdtIn > 0) {
            usdt.safeTransferFrom(msg.sender, address(this), usdtIn);
        }

        if (daiIn > 0) {
            dai.safeTransferFrom(msg.sender, address(this), daiIn);
        }

        if (totalUserStake(msg.sender) == 0) {
            totalStakers = totalStakers.add(1);
        }

        _stake(
            normalize(usdc, usdcIn),
            normalize(usdt, usdtIn),
            normalize(dai, daiIn),
            msg.sender
        );

        emit Stake(msg.sender, usdcIn, usdtIn, daiIn);
    }

    function withdraw(address to)
        public
        update
        nonReentrant
        returns (
            uint256 usdcOut,
            uint256 usdtOut,
            uint256 daiOut,
            uint256 reward
        )
    {
        totalStakers = totalStakers.sub(1);

        (usdcOut, usdtOut, daiOut, reward) = _applyReward(msg.sender);

        usdcOut = denormalize(usdc, usdcOut);
        usdtOut = denormalize(usdt, usdtOut);
        daiOut = denormalize(dai, daiOut);

        if (usdcOut > 0) {
            usdc.safeTransfer(to, usdcOut);
        }

        if (usdtOut > 0) {
            usdt.safeTransfer(to, usdtOut);
        }

        if (daiOut > 0) {
            dai.safeTransfer(to, daiOut);
        }

        if (reward > 0) {
            sarco.safeTransfer(to, reward);
            userClaimedRewards[msg.sender] = userClaimedRewards[msg.sender].add(
                reward
            );
            totalClaimedRewards = totalClaimedRewards.add(reward);

            emit Payout(msg.sender, reward, to);
        }

        emit Withdraw(msg.sender, usdcOut, usdtOut, daiOut, to);
    }

    function payout(address to)
        public
        update
        nonReentrant
        returns (uint256 reward)
    {
        (
            uint256 usdcOut,
            uint256 usdtOut,
            uint256 daiOut,
            uint256 _reward
        ) = _applyReward(msg.sender);

        reward = _reward;

        if (reward > 0) {
            sarco.safeTransfer(to, reward);
            userClaimedRewards[msg.sender] = userClaimedRewards[msg.sender].add(
                reward
            );
            totalClaimedRewards = totalClaimedRewards.add(reward);
        }

        _stake(usdcOut, usdtOut, daiOut, msg.sender);

        emit Payout(msg.sender, _reward, to);
    }

    function _stake(
        uint256 usdcIn,
        uint256 usdtIn,
        uint256 daiIn,
        address account
    ) private {
        uint256 addBackUsdc;
        uint256 addBackUsdt;
        uint256 addBackDai;

        if (totalUserStake(account) > 0) {
            (
                uint256 usdcOut,
                uint256 usdtOut,
                uint256 daiOut,
                uint256 reward
            ) = _applyReward(account);

            addBackUsdc = usdcOut;
            addBackUsdt = usdtOut;
            addBackDai = daiOut;

            _userStakedUsdc[account] = usdcOut;
            _userStakedUsdt[account] = usdtOut;
            _userStakedDai[account] = daiOut;

            _userAccumulated[account] = reward;
        }

        _userStakedUsdc[account] = _userStakedUsdc[account].add(usdcIn);
        _userStakedUsdt[account] = _userStakedUsdt[account].add(usdtIn);
        _userStakedDai[account] = _userStakedDai[account].add(daiIn);

        _userWeighted[account] = _totalWeight;

        _totalStakeUsdc = _totalStakeUsdc.add(usdcIn);
        _totalStakeUsdt = _totalStakeUsdt.add(usdtIn);
        _totalStakeDai = _totalStakeDai.add(daiIn);

        if (addBackUsdc > 0) {
            _totalStakeUsdc = _totalStakeUsdc.add(addBackUsdc);
        }

        if (addBackUsdt > 0) {
            _totalStakeUsdt = _totalStakeUsdt.add(addBackUsdt);
        }

        if (addBackDai > 0) {
            _totalStakeDai = _totalStakeDai.add(addBackDai);
        }
    }

    function _applyReward(address account)
        private
        returns (
            uint256 usdcOut,
            uint256 usdtOut,
            uint256 daiOut,
            uint256 reward
        )
    {
        uint256 _totalUserStake = totalUserStake(account);
        require(
            _totalUserStake > 0,
            "LiquidityMining::_applyReward: no stablecoins staked"
        );

        usdcOut = _userStakedUsdc[account];
        usdtOut = _userStakedUsdt[account];
        daiOut = _userStakedDai[account];

        reward = _totalUserStake
            .mul(_totalWeight.sub(_userWeighted[account]))
            .div(10**18)
            .add(_userAccumulated[account]);

        _totalStakeUsdc = _totalStakeUsdc.sub(usdcOut);
        _totalStakeUsdt = _totalStakeUsdt.sub(usdtOut);
        _totalStakeDai = _totalStakeDai.sub(daiOut);

        _userStakedUsdc[account] = 0;
        _userStakedUsdt[account] = 0;
        _userStakedDai[account] = 0;

        _userAccumulated[account] = 0;
    }

    function rescueTokens(
        address tokenToRescue,
        address to,
        uint256 amount
    ) public onlyOwner nonReentrant {
        if (tokenToRescue == address(usdc)) {
            require(
                amount <= usdc.balanceOf(address(this)).sub(_totalStakeUsdc),
                "LiquidityMining::rescueTokens: that usdc belongs to stakers"
            );
        } else if (tokenToRescue == address(usdt)) {
            require(
                amount <= usdt.balanceOf(address(this)).sub(_totalStakeUsdt),
                "LiquidityMining::rescueTokens: that usdt belongs to stakers"
            );
        } else if (tokenToRescue == address(dai)) {
            require(
                amount <= dai.balanceOf(address(this)).sub(_totalStakeDai),
                "LiquidityMining::rescueTokens: that dai belongs to stakers"
            );
        } else if (tokenToRescue == address(sarco)) {
            if (totalStakers > 0) {
                require(
                    amount <=
                        sarco.balanceOf(address(this)).sub(
                            totalRewards.sub(totalClaimedRewards)
                        ),
                    "LiquidityMining::rescueTokens: that sarco belongs to stakers"
                );
            }
        }

        ERC20(tokenToRescue).safeTransfer(to, amount);
    }
}
