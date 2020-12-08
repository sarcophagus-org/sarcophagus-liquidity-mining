import { useState, useEffect } from 'react'
import { BigNumber } from 'ethers'

const useTotalStakeUsdc = (liquidityMining) => {
  const [totalStakeUsdc, setTotalStakeUsdc] = useState(BigNumber.from(0))

  useEffect(() => {
    if (!liquidityMining) return

    liquidityMining.totalStakeUsdc().then(usdc => {
      setTotalStakeUsdc(usdc)
    }).catch(console.error)

    const addUsdc = (_, usdc) => {
      setTotalStakeUsdc(_usdc => _usdc.add(usdc))
    }

    const removeUsdc = (_, usdc) => {
      setTotalStakeUsdc(_usdc => _usdc.sub(usdc))
    }

    liquidityMining.on('Stake', addUsdc)
    liquidityMining.on('Withdraw', removeUsdc)

    return () => {
      liquidityMining.removeListener('Stake', addUsdc)
      liquidityMining.removeListener('Withdraw', removeUsdc)
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
    }).catch(console.error)

    const addUsdt = (_, __, usdt) => {
      setTotalStakeUsdt(_usdt => _usdt.add(usdt))
    }

    const removeUsdt = (_, __, usdt) => {
      setTotalStakeUsdt(_usdt => _usdt.sub(usdt))
    }

    liquidityMining.on('Stake', addUsdt)
    liquidityMining.on('Withdraw', removeUsdt)

    return () => {
      liquidityMining.removeListener('Stake', addUsdt)
      liquidityMining.removeListener('Withdraw', removeUsdt)
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
    }).catch(console.error)

    const addDai = (_, __, ___, dai) => {
      setTotalStakeDai(_dai => _dai.add(dai))
    }

    const removeDai = (_, __, ___, dai) => {
      setTotalStakeDai(_dai => _dai.sub(dai))
    }

    liquidityMining.on('Stake', addDai)
    liquidityMining.on('Withdraw', removeDai)

    return () => {
      liquidityMining.removeListener('Stake', addDai)
      liquidityMining.removeListener('Withdraw', removeDai)
    }
  }, [liquidityMining])

  return totalStakeDai
}

export {
  useTotalStakeUsdc,
  useTotalStakeUsdt,
  useTotalStakeDai,
}
