// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.6.12;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/math/SafeMath.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

contract LiquidityMining is Ownable, ReentrancyGuard {
    using SafeMath for uint256;
    using SafeMath for uint8;

    ERC20 public immutable usdc;
    ERC20 public immutable usdt;
    ERC20 public immutable dai;
    ERC20 public immutable sarco;

    uint256 public totalRewards;
    uint256 public startBlock;
    uint256 public firstStakeBlock;
    uint256 public blockLength;
    uint256 public perBlockReward;
    uint256 public claimedRewards;

    uint256 private _totalStakeUsdc;
    uint256 private _totalStakeUsdt;
    uint256 private _totalStakeDai;
    uint256 private _totalWeight;
    uint256 private _mostRecentValueCalcBlock;

    mapping(address => uint256) private _stakedUsdc;
    mapping(address => uint256) private _stakedUsdt;
    mapping(address => uint256) private _stakedDai;

    mapping(address => uint256) private _weighted;
    mapping(address => uint256) private _accumulated;

    event Stake(
        address indexed staker,
        uint256 usdcIn,
        uint256 usdtIn,
        uint256 daiIn
    );
    event Withdraw(
        address indexed staker,
        uint256 usdcOut,
        uint256 usdtOut,
        uint256 daiOut,
        uint256 reward
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
        usdcStake = denormalize(usdc, _stakedUsdc[user]);
    }

    function userStakeUsdt(address user)
        public
        view
        returns (uint256 usdtStake)
    {
        usdtStake = denormalize(usdt, _stakedUsdt[user]);
    }

    function userStakeDai(address user) public view returns (uint256 daiStake) {
        daiStake = denormalize(dai, _stakedDai[user]);
    }

    function deposit(
        uint256 _amount,
        uint256 _startBlock,
        uint256 _blockLength
    ) public onlyOwner {
        require(
            startBlock == 0,
            "LiquidityMining::deposit: already received deposit"
        );

        require(
            _startBlock >= block.number,
            "LiquidityMining::deposit: start block must be in future"
        );

        require(
            _amount.mod(_blockLength) == 0,
            "LiquidityMining::deposit: rewards mod length must be zero"
        );

        totalRewards = _amount;

        sarco.transferFrom(msg.sender, address(this), _amount);

        startBlock = _startBlock;
        blockLength = _blockLength;

        perBlockReward = _amount.div(_blockLength);
    }

    function totalStake() private view returns (uint256 total) {
        total = _totalStakeUsdc.add(_totalStakeUsdt).add(_totalStakeDai);
    }

    function totalUserStake(address user) private view returns (uint256 total) {
        total = _stakedUsdc[user].add(_stakedUsdt[user]).add(_stakedDai[user]);
    }

    modifier update() {
        if (_mostRecentValueCalcBlock == 0) {
            _mostRecentValueCalcBlock = firstStakeBlock;
        }

        uint256 lastBlock = firstStakeBlock.add(blockLength);
        uint256 totalCurrentStake = totalStake();

        if (totalCurrentStake > 0 && _mostRecentValueCalcBlock < lastBlock) {
            uint256 value = 0;
            uint256 sinceLastCalc = block.number.sub(_mostRecentValueCalcBlock);

            if (block.number < lastBlock) {
                value = sinceLastCalc.mul(perBlockReward);
            } else {
                uint256 sinceLastBlock = block.number.sub(lastBlock);
                value = (sinceLastCalc.sub(sinceLastBlock)).mul(perBlockReward);
            }

            _totalWeight = _totalWeight.add(
                value.mul(10**18).div(totalCurrentStake)
            );

            _mostRecentValueCalcBlock = block.number;
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
            block.number >= startBlock,
            "LiquidityMining::stake: staking isn't live yet"
        );
        require(
            sarco.balanceOf(address(this)) > 0,
            "LiquidityMining::stake: no sarco balance"
        );

        if (firstStakeBlock == 0) {
            firstStakeBlock = block.number;
        } else {
            require(
                block.number < firstStakeBlock.add(blockLength),
                "LiquidityMining::stake: staking is over"
            );
        }

        if (usdcIn > 0) {
            usdc.transferFrom(msg.sender, address(this), usdcIn);
        }

        if (usdtIn > 0) {
            usdt.transferFrom(msg.sender, address(this), usdtIn);
        }

        if (daiIn > 0) {
            dai.transferFrom(msg.sender, address(this), daiIn);
        }

        _stake(
            normalize(usdc, usdcIn),
            normalize(usdt, usdtIn),
            normalize(dai, daiIn)
        );
    }

    function withdraw()
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
        (usdcOut, usdtOut, daiOut, reward) = _applyReward();
        emit Withdraw(msg.sender, usdcOut, usdtOut, daiOut, reward);

        if (usdcOut > 0) {
            usdc.transfer(msg.sender, denormalize(usdc, usdcOut));
        }

        if (usdtOut > 0) {
            usdt.transfer(msg.sender, denormalize(usdt, usdtOut));
        }

        if (daiOut > 0) {
            dai.transfer(msg.sender, denormalize(dai, daiOut));
        }

        if (reward > 0) {
            sarco.transfer(msg.sender, reward);
            claimedRewards = claimedRewards.add(reward);
        }
    }

    function payout() public update nonReentrant returns (uint256 reward) {
        (
            uint256 usdcOut,
            uint256 usdtOut,
            uint256 daiOut,
            uint256 _reward
        ) = _applyReward();

        emit Withdraw(msg.sender, usdcOut, usdtOut, daiOut, _reward);
        reward = _reward;

        if (reward > 0) {
            sarco.transfer(msg.sender, reward);
            claimedRewards = claimedRewards.add(reward);
            _stake(usdcOut, usdtOut, daiOut);
        }
    }

    function _stake(
        uint256 usdcIn,
        uint256 usdtIn,
        uint256 daiIn
    ) private {
        uint256 addBackUsdc;
        uint256 addBackUsdt;
        uint256 addBackDai;

        if (totalUserStake(msg.sender) > 0) {
            (
                uint256 usdcOut,
                uint256 usdtOut,
                uint256 daiOut,
                uint256 reward
            ) = _applyReward();

            addBackUsdc = usdcOut;
            addBackUsdt = usdtOut;
            addBackDai = daiOut;

            _stakedUsdc[msg.sender] = usdcOut;
            _stakedUsdt[msg.sender] = usdtOut;
            _stakedDai[msg.sender] = daiOut;

            _accumulated[msg.sender] = reward;
        }

        _stakedUsdc[msg.sender] = _stakedUsdc[msg.sender].add(usdcIn);
        _stakedUsdt[msg.sender] = _stakedUsdt[msg.sender].add(usdtIn);
        _stakedDai[msg.sender] = _stakedDai[msg.sender].add(daiIn);

        _weighted[msg.sender] = _totalWeight;

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

        emit Stake(msg.sender, usdcIn, usdtIn, daiIn);
    }

    function _applyReward()
        private
        returns (
            uint256 usdcOut,
            uint256 usdtOut,
            uint256 daiOut,
            uint256 reward
        )
    {
        uint256 _totalUserStake = totalUserStake(msg.sender);
        require(
            _totalUserStake > 0,
            "LiquidityMining::_applyReward: no stablecoins staked"
        );

        usdcOut = _stakedUsdc[msg.sender];
        usdtOut = _stakedUsdt[msg.sender];
        daiOut = _stakedDai[msg.sender];

        reward = _totalUserStake
            .mul(_totalWeight.sub(_weighted[msg.sender]))
            .div(10**18)
            .add(_accumulated[msg.sender]);

        _totalStakeUsdc = _totalStakeUsdc.sub(usdcOut);
        _totalStakeUsdt = _totalStakeUsdt.sub(usdtOut);
        _totalStakeDai = _totalStakeDai.sub(daiOut);

        _stakedUsdc[msg.sender] = 0;
        _stakedUsdt[msg.sender] = 0;
        _stakedDai[msg.sender] = 0;

        _accumulated[msg.sender] = 0;
    }

    function rescueTokens(
        address tokenToRescue,
        address to,
        uint256 amount
    ) public onlyOwner nonReentrant returns (bool) {
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
            require(
                amount <=
                    sarco.balanceOf(address(this)).sub(
                        totalRewards.sub(claimedRewards)
                    ),
                "LiquidityMining::rescueTokens: that sarco belongs to stakers"
            );
        }

        return IERC20(tokenToRescue).transfer(to, amount);
    }
}
