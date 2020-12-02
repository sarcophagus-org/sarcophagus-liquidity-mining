import { useState, useEffect } from 'react'
import { BigNumber } from 'ethers'

const useTotalStakeUsdc = (liquidityMining) => {
  const [totalStakeUsdc, setTotalStakeUsdc] = useState(BigNumber.from(0))

  useEffect(() => {
    if (!liquidityMining) return

    liquidityMining.totalStakeUsdc().then(usdc => {
      setTotalStakeUsdc(usdc)
    })

    const updateUsdc = (_, usdc) => {
      setTotalStakeUsdc(_usdc => _usdc.add(usdc))
    }

    liquidityMining.on('Stake', updateUsdc)

    return () => {
      liquidityMining.removeListener('Stake', updateUsdc)
    }
  }, [liquidityMining])

  return totalStakeUsdc
}

const useTotalStakeUsdt = (liquidityMining) => {
  const [totalStakeUsdt, setTotalStakeUsdt] = useState(BigNumber.from(0))

  useEffect(() => {
    if (!liquidityMining) return

    liquidityMining.totalStakeUsdt().then(usdt => {
      setTotalStakeUsdt(usdt)
    })

    const updateUsdt = (_, __, usdt) => {
      setTotalStakeUsdt(_usdt => _usdt.add(usdt))
    }

    liquidityMining.on('Stake', updateUsdt)

    return () => {
      liquidityMining.removeListener('Stake', updateUsdt)
    }
  }, [liquidityMining])

  return totalStakeUsdt
}

const useTotalStakeDai = (liquidityMining) => {
  const [totalStakeDai, setTotalStakeDai] = useState(BigNumber.from(0))

  useEffect(() => {
    if (!liquidityMining) return

    liquidityMining.totalStakeDai().then(dai => {
      setTotalStakeDai(dai)
    })

    const updateDai = (_, __, ___, dai) => {
      setTotalStakeDai(_dai => _dai.add(dai))
    }

    liquidityMining.on('Stake', updateDai)

    return () => {
      liquidityMining.removeListener('Stake', updateDai)
    }
  }, [liquidityMining])

  return totalStakeDai
}

export {
  useTotalStakeUsdc,
  useTotalStakeUsdt,
  useTotalStakeDai,
}
