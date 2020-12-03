import { useState, useEffect } from 'react'
import { BigNumber } from 'ethers'
import { useWeb3 } from '../web3'

const useCurrentBlock = () => {
  const [currentBlock, setCurrentBlock] = useState(BigNumber.from(0))
  const { web3 } = useWeb3()

  useEffect(() => {
    if (!web3?.library) return

    web3.library.getBlockNumber().then(blockNumber => {
      setCurrentBlock(BigNumber.from(blockNumber))
    })

    const updateBlockNumber = (blockNumber) => {
      setCurrentBlock(BigNumber.from(blockNumber))
    }

    web3.library.on('block', updateBlockNumber)

    return () => {
      web3.library.removeListener('block', updateBlockNumber)
    }
  }, [web3?.library])

  return currentBlock
}

const useStartBlock = (liquidityMining) => {
  const [startBlock, setStartBlock] = useState(BigNumber.from(0))

  useEffect(() => {
    if (!liquidityMining) return

    liquidityMining.startBlock().then(startBlock => {
      setStartBlock(startBlock)
    })

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
      })
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
      })
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
