import { createContext, useContext } from 'react'
import { utils } from 'ethers'
import numeral from 'numeral'
import {
  useLiquidityMiningContract,
  useUsdcContract,
  useUsdtContract,
  useDaiContract,
  useSarcoContract,
  useDecimals
} from './contracts'
import {
  useTotalStakeUsdc,
  useTotalStakeUsdt,
  useTotalStakeDai,
} from './stakes'
import {
  useTotalRewards,
  useTotalClaimedRewards,
  useRewardsPerBlock
} from './rewards'
import {
  useCurrentBlock,
  useStartBlock,
  useFirstStakeBlock,
  useBlockLength,
} from './blocks'

let context

const createDataRoot = () => {
  context = createContext()

  context.displayName = "Data Provider"
  const Provider = context.Provider

  return ({ children }) => {
    const liquidityMining = useLiquidityMiningContract()

    const usdcContract = useUsdcContract(liquidityMining)
    const usdtContract = useUsdtContract(liquidityMining)
    const daiContract = useDaiContract(liquidityMining)
    const sarcoContract = useSarcoContract(liquidityMining)

    const decimalsUsdc = useDecimals(usdcContract)
    const decimalsUsdt = useDecimals(usdtContract)
    const decimalsDai = useDecimals(daiContract)
    const decimalsSarco = useDecimals(sarcoContract)

    const totalRewards = useTotalRewards(liquidityMining)
    const totalClaimedRewards = useTotalClaimedRewards(liquidityMining)

    const totalStakeUsdc = useTotalStakeUsdc(liquidityMining)
    const totalStakeUsdt = useTotalStakeUsdt(liquidityMining)
    const totalStakeDai = useTotalStakeDai(liquidityMining)

    const currentBlock = useCurrentBlock()
    const startBlock = useStartBlock(liquidityMining)
    const firstStakeBlock = useFirstStakeBlock(liquidityMining)
    const blockLength = useBlockLength(liquidityMining)

    const rewardsPerBlock = useRewardsPerBlock(totalRewards, blockLength)

    const dataContext = {
      totalRewards: numeral(utils.formatUnits(totalRewards, decimalsSarco)).format(`0,0.[${Array(decimalsSarco).fill(0)}]`),
      totalClaimedRewards: numeral(utils.formatUnits(totalClaimedRewards, decimalsSarco)).format(`0,0.[${Array(decimalsSarco).fill(0)}]`),
      rewardsPerBlock: numeral(utils.formatUnits(rewardsPerBlock, decimalsSarco)).format(`0,0.[${Array(decimalsSarco).fill(0)}]`),
      
      totalStakeUsdc: numeral(utils.formatUnits(totalStakeUsdc, decimalsUsdc)).format(`0,0.[${Array(decimalsUsdc).fill(0)}]`),
      totalStakeUsdt: numeral(utils.formatUnits(totalStakeUsdt, decimalsUsdt)).format(`0,0.[${Array(decimalsUsdt).fill(0)}]`),
      totalStakeDai: numeral(utils.formatUnits(totalStakeDai, decimalsDai)).format(`0,0.[${Array(decimalsDai).fill(0)}]`),

      currentBlock: numeral(currentBlock.toString()).format(),
      startBlock: numeral(startBlock.toString()).format(),
      firstStakeBlock: numeral(firstStakeBlock.toString()).format(),
      endingBlock: numeral(firstStakeBlock.add(blockLength).toString()).format(),
      blocksUntilKickoff: numeral(startBlock.sub(currentBlock).toString()).format(),
      remainingBlocks: numeral(firstStakeBlock.add(blockLength).sub(currentBlock).toString()).format()
    }

    return <Provider value={dataContext}>{children}</Provider>
  }
}

const DataProvider = createDataRoot()

const useData = () => {
  return useContext(context)
}

export { DataProvider, useData }