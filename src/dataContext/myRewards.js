import { useState, useEffect } from 'react'
import { BigNumber } from 'ethers'
import { useWeb3 } from '../web3'

const useMyPendingRewards = (liquidityMining, currentTime) => {
  const [pendingRewards, setPendingRewards] = useState(BigNumber.from(0))
  const { account } = useWeb3()

  useEffect(() => {
    if (!liquidityMining || !account) return

    liquidityMining.totalUserStake(account).then(stake => {
      if (stake.gt(0)) {
        liquidityMining.callStatic.payout().then(reward => {
          setPendingRewards(reward)
        }).catch(error => console.error(error))
      } else {
        setPendingRewards(BigNumber.from(0))
      }
    }).catch(error => console.error(error))
    
  }, [liquidityMining, currentTime, account])

  return pendingRewards
}

const useMyClaimedRewards = (liquidityMining) => {
  const [claimedRewards, setClaimedRewards] = useState(BigNumber.from(0))
  const { account } = useWeb3()

  useEffect(() => {
    if (!liquidityMining || !account) return

    liquidityMining.userClaimedRewards(account).then(reward => {
      setClaimedRewards(reward)
    }).catch(error => console.error(error))

    const addMyClaimedRewards = (_, reward) => {
      setClaimedRewards(rewards => rewards.add(reward))
    }

    const myClaimedRewardsFilter = liquidityMining.filters.Payout(account, null)
    liquidityMining.on(myClaimedRewardsFilter, addMyClaimedRewards)

    return () => {
      liquidityMining.removeListener(myClaimedRewardsFilter, addMyClaimedRewards)
    }
  }, [liquidityMining, account])

  return claimedRewards
}

export {
  useMyPendingRewards,
  useMyClaimedRewards
}