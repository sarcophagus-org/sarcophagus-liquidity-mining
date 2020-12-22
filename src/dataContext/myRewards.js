import { useState, useEffect } from 'react'
import { BigNumber } from 'ethers'
import { useWeb3 } from '../web3'

const useMyPendingRewards = (liquidityMining, currentBlock, currentTime, rewardIncrement, isActive) => {
  const [pendingRewards, setPendingRewards] = useState(BigNumber.from(0))
  const { account } = useWeb3()

  useEffect(() => {
    if (isActive) {
      setPendingRewards(pendingRewards => pendingRewards.add(rewardIncrement))
    }
  }, [currentTime, rewardIncrement, isActive])

  useEffect(() => {
    if (!liquidityMining || !account) return

    liquidityMining.totalUserStake(account).then(stake => {
      if (stake.gt(0)) {
        liquidityMining.callStatic.payout(account).then(reward => {
          setPendingRewards(reward)
        }).catch(console.error)
      } else {
        setPendingRewards(BigNumber.from(0))
      }
    }).catch(console.error)
    
  }, [liquidityMining, currentBlock, account])

  return pendingRewards
}

const useMyClaimedRewards = (liquidityMining) => {
  const [claimedRewards, setClaimedRewards] = useState(BigNumber.from(0))
  const { account } = useWeb3()

  useEffect(() => {
    if (!liquidityMining || !account) return

    liquidityMining.userClaimedRewards(account).then(reward => {
      setClaimedRewards(reward)
    }).catch(console.error)

    const addMyClaimedRewards = (_, reward) => {
      setClaimedRewards(rewards => rewards.add(reward))
    }

    const myClaimedRewardsFilter = liquidityMining.filters.Payout(account, null, null)
    liquidityMining.on(myClaimedRewardsFilter, addMyClaimedRewards)

    return () => {
      liquidityMining.removeListener(myClaimedRewardsFilter, addMyClaimedRewards)
    }
  }, [liquidityMining, account])

  return claimedRewards
}

const useMyRewardsPerTime = (liquidityMining, currentBlock, rewardPerTime, isActive) => {
  const [rewardIncrement, setRewardIncrement] = useState(BigNumber.from(0))
  const { account } = useWeb3()

  useEffect(() => {
    if (!liquidityMining || !account) return

    if (!isActive) {
      setRewardIncrement(BigNumber.from(0))
      return
    }

    Promise.all([liquidityMining.totalStake(), liquidityMining.totalUserStake(account)])
      .then(([total, user]) => {
        if (total.eq(0)) {
          setRewardIncrement(BigNumber.from(0))
        } else {
          setRewardIncrement(rewardPerTime.mul(user).div(total))
        }
      }).catch(console.error)
  }, [liquidityMining, account, currentBlock, rewardPerTime, isActive])

  return rewardIncrement
}

export {
  useMyPendingRewards,
  useMyClaimedRewards,
  useMyRewardsPerTime,
}
