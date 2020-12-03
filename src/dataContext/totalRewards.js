import { useState, useEffect } from 'react'
import { BigNumber } from 'ethers'

const useTotalRewards = (liquidityMining) => {
  const [totalSarcoRewards, setTotalSarcoRewards] = useState(BigNumber.from(0))

  useEffect(() => {
    if (!liquidityMining) return

    liquidityMining.totalRewards().then(sarco => {
      setTotalSarcoRewards(sarco)
    })

  }, [liquidityMining])

  return totalSarcoRewards
}

const useTotalClaimedRewards = (liquidityMining) => {
  const [totalClaimedSarcoRewards, setTotalClaimedSarcoRewards] = useState(BigNumber.from(0))

  useEffect(() => {
    if (!liquidityMining) return

    const getClaimedRewards = () => {
      liquidityMining.totalClaimedRewards().then(sarco => {
        setTotalClaimedSarcoRewards(sarco)
      })
    }

    getClaimedRewards()

    liquidityMining.on("Withdraw", getClaimedRewards)

    return () => {
      liquidityMining.removeListener("Withdraw", getClaimedRewards)
    }
  }, [liquidityMining])

  return totalClaimedSarcoRewards
}

const useRewardsPerBlock = (totalRewards, blockLength) => {
  const [rewardsPerBlock, setRewardsPerBlock] = useState(BigNumber.from(0))

  useEffect(() => {
    if (blockLength.eq(0)) return

    setRewardsPerBlock(totalRewards.div(blockLength))
  }, [blockLength, totalRewards])

  return rewardsPerBlock
}

export {
  useTotalRewards,
  useTotalClaimedRewards,
  useRewardsPerBlock
}
