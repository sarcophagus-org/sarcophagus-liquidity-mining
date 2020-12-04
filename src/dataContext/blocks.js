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

    const updateBlockLength = () => {
      liquidityMining.blockLength().then(blockLength => {
        setBlockLength(blockLength)
      }).catch(error => console.error(error))
    }

    updateBlockLength()

    if (firstStakeBlock.eq(0)) {
      liquidityMining.on('Stake', updateBlockLength)
    }

    return () => {
      if (firstStakeBlock.eq(0)) {
        liquidityMining.removeListener('Stake', updateBlockLength)
      }
    }
  }, [liquidityMining, firstStakeBlock])

  return blockLength
}

export {
  useCurrentBlock,
  useStartBlock,
  useFirstStakeBlock,
  useBlockLength,
}
