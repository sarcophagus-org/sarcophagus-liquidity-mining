import { useState, useEffect } from 'react'
import { useWeb3 } from '../web3'

const useCanStake = (blocksUntilKickoff, startBlock, firstStakeBlock, remainingBlocks, endingBlock) => {
  const { account } = useWeb3()
  const [canStake, setCanStake] = useState(false)

  useEffect(() => {
    setCanStake(
      account && (
        (
          startBlock.gt(0) &&
          blocksUntilKickoff.eq(0) &&
          endingBlock.eq(0)
        ) || (
          firstStakeBlock.gt(0) &&
          remainingBlocks.gt(0)
        )
      )
    )
  }, [account, blocksUntilKickoff, startBlock, firstStakeBlock, remainingBlocks, endingBlock])

  return canStake
}

export {
  useCanStake
}
