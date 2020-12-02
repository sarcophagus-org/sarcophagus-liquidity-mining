import { useState, useEffect } from 'react'
import { BigNumber } from 'ethers'
import { useWeb3 } from '../web3'

const useMyStakeUsdc = (liquidityMining) => {
  const [myStakeUsdc, setMyStakeUsdc] = useState(BigNumber.from(0))
  const { account } = useWeb3()

  useEffect(() => {
    if (!liquidityMining || !account) return

    liquidityMining.userStakeUsdc(account).then(usdc => {
      setMyStakeUsdc(usdc)
    })

    const addUsdc = (_, usdc) => {
      setMyStakeUsdc(_usdc => _usdc.add(usdc))
    }

    const removeUsdc = (_, usdc) => {
      setMyStakeUsdc(_usdc => _usdc.sub(usdc))
    }

    liquidityMining.on('Stake', addUsdc)
    liquidityMining.on('Withdraw', removeUsdc)

    return () => {
      liquidityMining.removeListener('Stake', addUsdc)
      liquidityMining.removeListener('Withdraw', removeUsdc)
    }
  }, [liquidityMining, account])

  return myStakeUsdc
}

const useMyStakeUsdt = (liquidityMining) => {
  const [myStakeUsdt, setMyStakeUsdt] = useState(BigNumber.from(0))
  const { account } = useWeb3()

  useEffect(() => {
    if (!liquidityMining || !account) return

    liquidityMining.userStakeUsdt(account).then(usdt => {
      setMyStakeUsdt(usdt)
    })

    const addUsdt = (_, __, usdt) => {
      setMyStakeUsdt(_usdt => _usdt.add(usdt))
    }

    const removeUsdt = (_, __, usdt) => {
      setMyStakeUsdt(_usdt => _usdt.sub(usdt))
    }

    liquidityMining.on('Stake', addUsdt)
    liquidityMining.on('Withdraw', removeUsdt)

    return () => {
      liquidityMining.removeListener('Stake', addUsdt)
      liquidityMining.removeListener('Withdraw', removeUsdt)
    }
  }, [liquidityMining, account])

  return myStakeUsdt
}

const useMyStakeDai = (liquidityMining) => {
  const [myStakeDai, setMyStakeDai] = useState(BigNumber.from(0))
  const { account } = useWeb3()

  useEffect(() => {
    if (!liquidityMining || !account) return

    liquidityMining.userStakeDai(account).then(dai => {
      setMyStakeDai(dai)
    })

    const addDai = (_, __, ___, dai) => {
      setMyStakeDai(_dai => _dai.add(dai))
    }

    const removeDai = (_, __, ___, dai) => {
      setMyStakeDai(_dai => _dai.sub(dai))
    }

    liquidityMining.on('Stake', addDai)
    liquidityMining.on('Withdraw', removeDai)

    return () => {
      liquidityMining.removeListener('Stake', addDai)
      liquidityMining.removeListener('Withdraw', removeDai)
    }
  }, [liquidityMining, account])

  return myStakeDai
}

export {
  useMyStakeUsdc,
  useMyStakeUsdt,
  useMyStakeDai
}
