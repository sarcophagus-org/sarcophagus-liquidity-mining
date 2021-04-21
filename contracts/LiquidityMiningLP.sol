// SPDX-License-Identifier: MIT

pragma solidity ^0.6.12;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/math/SafeMath.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/SafeERC20.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

contract LiquidityMiningLP is Ownable, ReentrancyGuard {
    using SafeMath for uint256;
    using SafeERC20 for ERC20;

    ERC20 public immutable lp;
    ERC20 public immutable sarco;

    uint256 public totalStakers;
    uint256 public totalRewards;
    uint256 public totalClaimedRewards;
    uint256 public startTime;
    uint256 public firstStakeTime;
    uint256 public endTime;

    uint256 public totalStakeLp;
    uint256 private _totalWeight;
    uint256 private _mostRecentValueCalcTime;

    mapping(address => uint256) public userClaimedRewards;

    mapping(address => uint256) public userStakeLp;
    mapping(address => uint256) private _userWeighted;
    mapping(address => uint256) private _userAccumulated;

    event Deposit(uint256 totalRewards, uint256 startTime, uint256 endTime);
    event Stake(address indexed staker, uint256 lpIn);
    event Payout(address indexed staker, uint256 reward, address to);
    event Withdraw(address indexed staker, uint256 lpOut, address to);

    constructor(
        address _lp,
        address _sarco
    ) public {
        lp = ERC20(_lp);
        sarco = ERC20(_sarco);
    }

    function deposit(
        uint256 _totalRewards,
        uint256 _startTime,
        uint256 _endTime
    ) public onlyOwner {
        require(
            startTime == 0,
            "LiquidityMiningLP::deposit: already received deposit"
        );

        require(
            _startTime >= block.timestamp,
            "LiquidityMiningLP::deposit: start time must be in future"
        );

        require(
            _endTime > _startTime,
            "LiquidityMiningLP::deposit: end time must after start time"
        );

        require(
            sarco.balanceOf(address(this)) == _totalRewards,
            "LiquidityMiningLP::deposit: contract balance does not equal expected _totalRewards"
        );

        totalRewards = _totalRewards;
        startTime = _startTime;
        endTime = _endTime;

        emit Deposit(_totalRewards, _startTime, _endTime);
    }

    modifier update() {
        if (_mostRecentValueCalcTime == 0) {
            _mostRecentValueCalcTime = firstStakeTime;
        }

        uint256 totalCurrentStake = totalStakeLp;

        if (totalCurrentStake > 0 && _mostRecentValueCalcTime < endTime) {
            uint256 value = 0;
            uint256 sinceLastCalc =
                block.timestamp.sub(_mostRecentValueCalcTime);
            uint256 perSecondReward =
                totalRewards.div(endTime.sub(firstStakeTime));

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

    function stake(uint256 lpIn) public update nonReentrant {
        require(lpIn > 0, "LiquidityMiningLP::stake: missing LP");
        require(
            block.timestamp >= startTime,
            "LiquidityMiningLP::stake: staking isn't live yet"
        );
        require(
            sarco.balanceOf(address(this)) > 0,
            "LiquidityMiningLP::stake: no sarco balance"
        );

        if (firstStakeTime == 0) {
            firstStakeTime = block.timestamp;
        } else {
            require(
                block.timestamp < endTime,
                "LiquidityMiningLP::stake: staking is over"
            );
        }

        lp.safeTransferFrom(msg.sender, address(this), lpIn);

        if (userStakeLp[msg.sender] == 0) {
            totalStakers = totalStakers.add(1);
        }

        _stake(lpIn, msg.sender);

        emit Stake(msg.sender, lpIn);
    }

    function withdraw(address to)
        public
        update
        nonReentrant
        returns (uint256 lpOut, uint256 reward)
    {
        totalStakers = totalStakers.sub(1);

        (lpOut, reward) = _applyReward(msg.sender);

        lp.safeTransfer(to, lpOut);

        if (reward > 0) {
            sarco.safeTransfer(to, reward);
            userClaimedRewards[msg.sender] = userClaimedRewards[msg.sender].add(
                reward
            );
            totalClaimedRewards = totalClaimedRewards.add(reward);

            emit Payout(msg.sender, reward, to);
        }

        emit Withdraw(msg.sender, lpOut, to);
    }

    function payout(address to)
        public
        update
        nonReentrant
        returns (uint256 reward)
    {
        require(
            block.timestamp < endTime,
            "LiquidityMiningLP::payout: withdraw instead"
        );

        (uint256 lpOut, uint256 _reward) = _applyReward(msg.sender);

        reward = _reward;

        if (reward > 0) {
            sarco.safeTransfer(to, reward);
            userClaimedRewards[msg.sender] = userClaimedRewards[msg.sender].add(
                reward
            );
            totalClaimedRewards = totalClaimedRewards.add(reward);
        }

        _stake(lpOut, msg.sender);

        emit Payout(msg.sender, _reward, to);
    }

    function _stake(uint256 lpIn, address account) private {
        uint256 addBackLp;

        if (userStakeLp[account] > 0) {
            (uint256 lpOut, uint256 reward) = _applyReward(account);
            addBackLp = lpOut;
            userStakeLp[account] = lpOut;
            _userAccumulated[account] = reward;
        }

        userStakeLp[account] = userStakeLp[account].add(lpIn);
        _userWeighted[account] = _totalWeight;

        totalStakeLp = totalStakeLp.add(lpIn);

        if (addBackLp > 0) {
            totalStakeLp = totalStakeLp.add(addBackLp);
        }
    }

    function _applyReward(address account)
        private
        returns (uint256 lpOut, uint256 reward)
    {
        require(
            userStakeLp[account] > 0,
            "LiquidityMiningLP::_applyReward: no LP staked"
        );

        lpOut = userStakeLp[account];

        reward = lpOut
            .mul(_totalWeight.sub(_userWeighted[account]))
            .div(10**18)
            .add(_userAccumulated[account]);

        totalStakeLp = totalStakeLp.sub(lpOut);

        userStakeLp[account] = 0;
        _userAccumulated[account] = 0;
    }

    function rescueTokens(
        address tokenToRescue,
        address to,
        uint256 amount
    ) public onlyOwner nonReentrant {
        if (tokenToRescue == address(lp)) {
            require(
                amount <= lp.balanceOf(address(this)).sub(totalStakeLp),
                "LiquidityMiningLP::rescueTokens: that LP belongs to stakers"
            );
        } else if (tokenToRescue == address(sarco)) {
            if (totalStakers > 0) {
                require(
                    amount <=
                        sarco.balanceOf(address(this)).sub(
                            totalRewards.sub(totalClaimedRewards)
                        ),
                    "LiquidityMiningLP::rescueTokens: that sarco belongs to stakers"
                );
            }
        }

        ERC20(tokenToRescue).safeTransfer(to, amount);
    }
}
