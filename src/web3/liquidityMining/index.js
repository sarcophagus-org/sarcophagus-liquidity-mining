import { useState, useEffect } from 'react'
import { utils } from 'ethers'
import {
  useLiquidityMiningContract,
  useUsdcContract,
  useUsdtContract,
  useDaiContract,
  useSarcoContract
} from './contracts'

const useTotalUsdcDeposits = () => {
  const liquidityMining = useLiquidityMiningContract()
  const usdcContract = useUsdcContract()
  const [totalUsdcDeposits, setTotalUsdcDeposits] = useState("0.0")

  useEffect(() => {
    if (!liquidityMining || !usdcContract ) return

    usdcContract.decimals().then(decimals => {
      liquidityMining.totalStakeUsdc().then(usdc => {
        setTotalUsdcDeposits(utils.formatUnits(usdc, decimals))
      })
    })

  }, [liquidityMining, usdcContract])

  return totalUsdcDeposits
}

const useTotalUsdtDeposits = () => {
  const liquidityMining = useLiquidityMiningContract()
  const usdtContract = useUsdtContract()
  const [totalUsdtDeposits, setTotalUsdtDeposits] = useState("0.0")

  useEffect(() => {
    if (!liquidityMining || !usdtContract ) return

    usdtContract.decimals().then(decimals => {
      liquidityMining.totalStakeUsdt().then(usdt => {
        setTotalUsdtDeposits(utils.formatUnits(usdt, decimals))
      })
    })

  }, [liquidityMining, usdtContract])

  return totalUsdtDeposits
}

const useTotalDaiDeposits = () => {
  const liquidityMining = useLiquidityMiningContract()
  const daiContract = useDaiContract()
  const [totalDaiDeposits, setTotalDaiDeposits] = useState("0.0")

  useEffect(() => {
    if (!liquidityMining || !daiContract ) return

    daiContract.decimals().then(decimals => {
      liquidityMining.totalStakeDai().then(dai => {
        setTotalDaiDeposits(utils.formatUnits(dai, decimals))
      })
    })

  }, [liquidityMining, daiContract])

  return totalDaiDeposits
}

const useTotalSarcoRewards = () => {
  const liquidityMining = useLiquidityMiningContract()
  const sarcoContract = useSarcoContract()
  const [totalSarcoRewards, setTotalSarcoRewards] = useState("0.0")

  useEffect(() => {
    if (!liquidityMining || !sarcoContract ) return

    sarcoContract.decimals().then(decimals => {
      liquidityMining.totalRewards().then(sarco => {
        setTotalSarcoRewards(utils.formatUnits(sarco, decimals))
      })
    })
  }, [liquidityMining, sarcoContract])

  return totalSarcoRewards
}

const useTotalClaimedSarcoRewards = () => {
  const liquidityMining = useLiquidityMiningContract()
  const sarcoContract = useSarcoContract()
  const [totalClaimedSarcoRewards, setTotalClaimedSarcoRewards] = useState("0.0")

  useEffect(() => {
    if (!liquidityMining || !sarcoContract ) return

    sarcoContract.decimals().then(decimals => {
      liquidityMining.claimedRewards().then(sarco => {
        setTotalClaimedSarcoRewards(utils.formatUnits(sarco, decimals))
      })
    })
  }, [liquidityMining, sarcoContract])

  return totalClaimedSarcoRewards
}

const usePerBlockSarcoRewards = () => {
  const liquidityMining = useLiquidityMiningContract()
  const sarcoContract = useSarcoContract()
  const [perBlockSarcoRewards, setPerBlockSarcoRewards] = useState("0.0")

  useEffect(() => {
    if (!liquidityMining || !sarcoContract ) return

    sarcoContract.decimals().then(decimals => {
      liquidityMining.perBlockReward().then(sarco => {
        setPerBlockSarcoRewards(utils.formatUnits(sarco, decimals))
      })
    })
  }, [liquidityMining, sarcoContract])

  return perBlockSarcoRewards
}

export {
  useTotalUsdcDeposits,
  useTotalUsdtDeposits,
  useTotalDaiDeposits,
  useTotalSarcoRewards,
  useTotalClaimedSarcoRewards,
  usePerBlockSarcoRewards
}
