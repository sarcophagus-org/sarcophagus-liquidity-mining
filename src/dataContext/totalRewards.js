import { useState, useEffect } from 'react'
import { BigNumber } from 'ethers'

const useTotalRewards = (liquidityMining) => {
  const [totalSarcoRewards, setTotalSarcoRewards] = useState(BigNumber.from(0))

  useEffect(() => {
    if (!liquidityMining) return

    liquidityMining.totalRewards().then(sarco => {
      setTotalSarcoRewards(sarco)
    }).catch(console.error)

    const updateTotalRewards = (totalRewards) => {
      setTotalSarcoRewards(totalRewards)
    }

    liquidityMining.on('Deposit', updateTotalRewards)

    return () => {
      liquidityMining.removeListener('Deposit', updateTotalRewards)
    }

  }, [liquidityMining])

  return totalSarcoRewards
}

const useTotalClaimedRewards = (liquidityMining) => {
  const [totalClaimedSarcoRewards, setTotalClaimedSarcoRewards] = useState(BigNumber.from(0))

  useEffect(() => {
    if (!liquidityMining) return

    liquidityMining.totalClaimedRewards().then(sarco => {
        setTotalClaimedSarcoRewards(sarco)
      }).catch(console.error)

    const getClaimedRewards = (_, _sarco) => {
      setTotalClaimedSarcoRewards(sarco => sarco.add(_sarco))
    }

    liquidityMining.on('Payout', getClaimedRewards)

    return () => {
      liquidityMining.removeListener('Payout', getClaimedRewards)
    }
  }, [liquidityMining])

  return totalClaimedSarcoRewards
}

const useRewardsPerTime = (totalRewards, startTime, firstStakeTime, endTime) => {
  const [rewardsPerTime, setRewardsPerTime] = useState(BigNumber.from(0))

  useEffect(() => {
    if (startTime.eq(0)) {
      setRewardsPerTime(BigNumber.from(0))
      return
    }

    if (firstStakeTime.eq(0)) {
      setRewardsPerTime(totalRewards.div(endTime.sub(startTime)))
      return
    }

    setRewardsPerTime(totalRewards.div(endTime.sub(firstStakeTime)))
  }, [totalRewards, startTime, firstStakeTime, endTime])

  return rewardsPerTime
}

export {
  useTotalRewards,
  useTotalClaimedRewards,
  useRewardsPerTime,
}
