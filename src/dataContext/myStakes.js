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
    }).catch(console.error)

    const addUsdc = (_, usdc) => {
      setMyStakeUsdc(_usdc => _usdc.add(usdc))
    }

    const removeUsdc = (_, usdc) => {
      setMyStakeUsdc(_usdc => _usdc.sub(usdc))
    }

    const myStakeFilter = liquidityMining.filters.Stake(account, null, null, null)
    liquidityMining.on(myStakeFilter, addUsdc)

    const myWithdrawFilter = liquidityMining.filters.Withdraw(account, null, null, null, null)
    liquidityMining.on(myWithdrawFilter, removeUsdc)

    return () => {
      liquidityMining.removeListener(myStakeFilter, addUsdc)
      liquidityMining.removeListener(myWithdrawFilter, removeUsdc)
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
    }).catch(console.error)

    const addUsdt = (_, __, usdt) => {
      setMyStakeUsdt(_usdt => _usdt.add(usdt))
    }

    const removeUsdt = (_, __, usdt) => {
      setMyStakeUsdt(_usdt => _usdt.sub(usdt))
    }

    const myStakeFilter = liquidityMining.filters.Stake(account, null, null, null)
    liquidityMining.on(myStakeFilter, addUsdt)

    const myWithdrawFilter = liquidityMining.filters.Withdraw(account, null, null, null, null)
    liquidityMining.on(myWithdrawFilter, removeUsdt)

    return () => {
      liquidityMining.removeListener(myStakeFilter, addUsdt)
      liquidityMining.removeListener(myWithdrawFilter, removeUsdt)
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
    }).catch(console.error)

    const addDai = (_, __, ___, dai) => {
      setMyStakeDai(_dai => _dai.add(dai))
    }

    const removeDai = (_, __, ___, dai) => {
      setMyStakeDai(_dai => _dai.sub(dai))
    }

    const myStakeFilter = liquidityMining.filters.Stake(account, null, null, null)
    liquidityMining.on(myStakeFilter, addDai)

    const myWithdrawFilter = liquidityMining.filters.Withdraw(account, null, null, null, null)
    liquidityMining.on(myWithdrawFilter, removeDai)

    return () => {
      liquidityMining.removeListener(myStakeFilter, addDai)
      liquidityMining.removeListener(myWithdrawFilter, removeDai)
    }
  }, [liquidityMining, account])

  return myStakeDai
}

export {
  useMyStakeUsdc,
  useMyStakeUsdt,
  useMyStakeDai
}
