// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.6.12;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/math/SafeMath.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

contract LiquidityMining is Ownable, ReentrancyGuard {
    using SafeMath for uint256;

    IERC20 public immutable _usdc;
    IERC20 public immutable _usdt;
    IERC20 public immutable _dai;
    IERC20 public immutable _sarco;

    uint256 public _totalRewards;
    uint256 public _startBlock;
    uint256 public _blockLength;
    uint256 public _perBlockReward;
    uint256 public _claimedRewards;

    uint256 public _totalStakeUsdc;
    uint256 public _totalStakeUsdt;
    uint256 public _totalStakeDai;
    uint256 public _totalWeight;

    uint256 public _firstStakeBlock;
    uint256 public _mostRecentValueCalcBlock;

    mapping(address => uint256) public _stakedUsdc;
    mapping(address => uint256) public _stakedUsdt;
    mapping(address => uint256) public _stakedDai;

    mapping(address => uint256) public _weighted;
    mapping(address => uint256) public _accumulated;

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
        address usdc,
        address usdt,
        address dai,
        address sarco,
        address owner
    ) public {
        _usdc = IERC20(usdc);
        _usdt = IERC20(usdt);
        _dai = IERC20(dai);
        _sarco = IERC20(sarco);

        transferOwnership(owner);
    }

    function deposit(
        uint256 amount,
        uint256 startBlock,
        uint256 blockLength
    ) public onlyOwner {
        require(
            _startBlock == 0,
            "LiquidityMining::deposit: already received deposit"
        );

        require(
            startBlock >= block.number,
            "LiquidityMining::deposit: start block must be in future"
        );

        require(
            amount.mod(blockLength) == 0,
            "LiquidityMining::deposit: rewards mod length must be zero"
        );

        _totalRewards = amount;

        _sarco.transferFrom(msg.sender, address(this), amount);

        _startBlock = startBlock;
        _blockLength = blockLength;

        _perBlockReward = amount.div(blockLength);
    }

    function totalStake() private view returns (uint256 total) {
        total = _totalStakeUsdc.add(_totalStakeUsdt).add(_totalStakeDai);
    }

    function totalUserStake(address user) private view returns (uint256 total) {
        total = _stakedUsdc[user].add(_stakedUsdt[user]).add(_stakedDai[user]);
    }

    modifier update() {
        if (_mostRecentValueCalcBlock == 0) {
            _mostRecentValueCalcBlock = _firstStakeBlock;
        }

        uint256 lastBlock = _firstStakeBlock.add(_blockLength);
        uint256 totalCurrentStake = totalStake();

        if (totalCurrentStake > 0 && _mostRecentValueCalcBlock < lastBlock) {
            uint256 value = 0;
            uint256 sinceLastCalc = block.number.sub(_mostRecentValueCalcBlock);

            if (block.number < lastBlock) {
                value = sinceLastCalc.mul(_perBlockReward);
            } else {
                uint256 sinceLastBlock = block.number.sub(lastBlock);
                value = (sinceLastCalc.sub(sinceLastBlock)).mul(
                    _perBlockReward
                );
            }

            _totalWeight = _totalWeight.add(
                value.mul(10**18).div(totalCurrentStake)
            );

            _mostRecentValueCalcBlock = block.number;
        }

        _;
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
            block.number >= _startBlock,
            "LiquidityMining::stake: staking isn't live yet"
        );
        require(
            _sarco.balanceOf(address(this)) > 0,
            "LiquidityMining::stake: no sarco balance"
        );

        if (_firstStakeBlock == 0) {
            _firstStakeBlock = block.number;
        } else {
            require(
                block.number < _firstStakeBlock.add(_blockLength),
                "LiquidityMining::stake: staking is over"
            );
        }

        if (usdcIn > 0) {
            _usdc.transferFrom(msg.sender, address(this), usdcIn);
        }

        if (usdtIn > 0) {
            _usdt.transferFrom(msg.sender, address(this), usdtIn);
        }

        if (daiIn > 0) {
            _dai.transferFrom(msg.sender, address(this), daiIn);
        }

        _stake(usdcIn, usdtIn, daiIn);
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
            _usdc.transfer(msg.sender, usdcOut);
        }

        if (usdtOut > 0) {
            _usdt.transfer(msg.sender, usdtOut);
        }

        if (daiOut > 0) {
            _dai.transfer(msg.sender, daiOut);
        }

        if (reward > 0) {
            _sarco.transfer(msg.sender, reward);
            _claimedRewards = _claimedRewards.add(reward);
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
            _sarco.transfer(msg.sender, reward);
            _claimedRewards = _claimedRewards.add(reward);
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
        if (tokenToRescue == address(_usdc)) {
            require(
                amount <= _usdc.balanceOf(address(this)).sub(_totalStakeUsdc),
                "LiquidityMining::rescueTokens: that usdc belongs to stakers"
            );
        } else if (tokenToRescue == address(_usdt)) {
            require(
                amount <= _usdt.balanceOf(address(this)).sub(_totalStakeUsdt),
                "LiquidityMining::rescueTokens: that usdt belongs to stakers"
            );
        } else if (tokenToRescue == address(_dai)) {
            require(
                amount <= _dai.balanceOf(address(this)).sub(_totalStakeDai),
                "LiquidityMining::rescueTokens: that dai belongs to stakers"
            );
        } else if (tokenToRescue == address(_sarco)) {
            require(
                amount <=
                    _sarco.balanceOf(address(this)).sub(
                        _totalRewards.sub(_claimedRewards)
                    ),
                "LiquidityMining::rescueTokens: that sarco belongs to stakers"
            );
        }

        return IERC20(tokenToRescue).transfer(to, amount);
    }
}
