import { useState, useEffect } from 'react'
import { useWeb3 } from '../web3'

const useCanStake = (timeUntilKickoff, startTime, endTime, firstStakeTime, remainingTime, currentTime) => {
  const { account } = useWeb3()
  const [canStake, setCanStake] = useState(false)

  useEffect(() => {
    setCanStake(
      account && (
        (
          // waiting for first stake
          timeUntilKickoff.eq(0) &&
          startTime.gt(0) &&
          endTime.gt(0) &&
          currentTime.lt(endTime)
        ) || (
          // staking active
          firstStakeTime.gt(0) &&
          remainingTime.gt(0)
        )
      )
    )
  }, [account, timeUntilKickoff, startTime, endTime, firstStakeTime, remainingTime, currentTime])

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
