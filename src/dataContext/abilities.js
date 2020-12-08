import { useState, useEffect } from 'react'
import { useWeb3 } from '../web3'

const useCanStake = (systemState, StateEnum) => {
  const { account } = useWeb3()
  const [canStake, setCanStake] = useState(false)

  useEffect(() => {
    setCanStake(account && [StateEnum.Ready, StateEnum.Active].includes(systemState))
  }, [account, systemState, StateEnum])

  return canStake
}

const useCanPayout = (pendingRewards) => {
  const { account } = useWeb3()
  const [canPayout, setCanPayout] = useState(false)

  useEffect(() => {
    setCanPayout(account && pendingRewards.gt(0))
  }, [account, pendingRewards])

  return canPayout
}

const useCanWithdraw = (usdc, usdt, dai) => {
  const { account } = useWeb3()
  const [canWithdraw, setCanWithdraw] = useState(false)

  useEffect(() => {
    setCanWithdraw(account && (usdc.gt(0) || usdt.gt(0) || dai.gt(0)))
  }, [account, usdc, usdt, dai])

  return canWithdraw
}

export {
  useCanStake,
  useCanPayout,
  useCanWithdraw,
}
