import { useState, useEffect } from 'react'
import { BigNumber } from 'ethers'
import { useWeb3 } from '../web3'

const useCurrentBlock = () => {
  const [currentBlock, setCurrentBlock] = useState(BigNumber.from(0))
  const { provider } = useWeb3()

  useEffect(() => {
    if (!provider) return

    provider.getBlockNumber().then(blockNumber => {
      setCurrentBlock(BigNumber.from(blockNumber))
    }).catch(error => console.error(error))

    const updateBlockNumber = (blockNumber) => {
      setCurrentBlock(BigNumber.from(blockNumber))
    }

    provider.on('block', updateBlockNumber)

    return () => {
      provider.removeListener('block', updateBlockNumber)
    }
  }, [provider])

  return currentBlock
}

const useStartBlock = (liquidityMining) => {
  const [startBlock, setStartBlock] = useState(BigNumber.from(0))

  useEffect(() => {
    if (!liquidityMining) return

    liquidityMining.startBlock().then(startBlock => {
      setStartBlock(startBlock)
    }).catch(error => console.error(error))

    const updateStartBlock = (_, startBlock) => {
      setStartBlock(startBlock)
    }

    liquidityMining.on('Deposit', updateStartBlock)

    return () => {
      liquidityMining.removeListener('Deposit', updateStartBlock)
    }

  }, [liquidityMining])

  return startBlock
}

const useFirstStakeBlock = (liquidityMining) => {
  const [firstStakeBlock, setFirstStakeBlock] = useState(BigNumber.from(0))

  useEffect(() => {
    if (!liquidityMining) return

    const updateFirstStake = () => {
      liquidityMining.firstStakeBlock().then(firstStakeBlock => {
        setFirstStakeBlock(firstStakeBlock)
      }).catch(error => console.error(error))
    }

    updateFirstStake()

    liquidityMining.on('Stake', updateFirstStake)

    return () => {
      liquidityMining.removeListener('Stake', updateFirstStake)
    }

  }, [liquidityMining])

  return firstStakeBlock
}

const useBlockLength = (liquidityMining) => {
  const [blockLength, setBlockLength] = useState(BigNumber.from(0))
  const firstStakeBlock = useFirstStakeBlock(liquidityMining)

  useEffect(() => {
    if (!liquidityMining) return

    liquidityMining.blockLength().then(blockLength => {
      setBlockLength(blockLength)
    }).catch(error => console.error(error))

    const updateBlockLength = (_, __, _blockLength) => {
      setBlockLength(_blockLength)
    }

    liquidityMining.on('Deposit', updateBlockLength)

    return () => {
      liquidityMining.removeListener('Deposit', updateBlockLength)
    }
  }, [liquidityMining, firstStakeBlock])

  return blockLength
}

const useElapsedBlocks = (currentBlock, firstStakeBlock, blockLength) => {
  const [elapsedBlocks, setElapsedBlocks] = useState(BigNumber.from(0))

  useEffect(() => {
    if (firstStakeBlock.eq(0)) {
      setElapsedBlocks(BigNumber.from(0))
      return
    }

    if (firstStakeBlock.add(blockLength).lt(currentBlock)) {
      setElapsedBlocks(blockLength)
      return
    }

    setElapsedBlocks(currentBlock.sub(firstStakeBlock))
  }, [currentBlock, firstStakeBlock, blockLength])

  return elapsedBlocks
}

const useRemainingBlocks = (firstStakeBlock, elapsedBlocks, blockLength) => {
  const [remainingBlocks, setRemainingBlocks] = useState(BigNumber.from(0))

  useEffect(() => {
    if (firstStakeBlock.eq(0)) {
      setRemainingBlocks(BigNumber.from(0))
      return
    }

    setRemainingBlocks(blockLength.sub(elapsedBlocks))
  }, [firstStakeBlock, elapsedBlocks, blockLength])

  return remainingBlocks 
}

const useBlocksUntilKickoff = (currentBlock, startBlock) => {
  const [blocksUntilKickoff, setBlocksUntilKickoff] = useState(BigNumber.from(0))

  useEffect(() => {
    if (currentBlock.gt(startBlock)) {
      setBlocksUntilKickoff(BigNumber.from(0))
      return
    }

    setBlocksUntilKickoff(startBlock.sub(currentBlock))
  }, [startBlock, currentBlock])

  return blocksUntilKickoff
}

export {
  useCurrentBlock,
  useStartBlock,
  useFirstStakeBlock,
  useBlockLength,
  useElapsedBlocks,
  useRemainingBlocks,
  useBlocksUntilKickoff,
}
