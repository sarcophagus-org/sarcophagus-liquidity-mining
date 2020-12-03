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
} from './totalStakes'
import {
  useTotalRewards,
  useTotalClaimedRewards,
  useRewardsPerBlock
} from './totalRewards'
import {
  useCurrentBlock,
  useStartBlock,
  useFirstStakeBlock,
  useBlockLength,
} from './blocks'
import {
  useMyStakeUsdc,
  useMyStakeUsdt,
  useMyStakeDai,
} from './myStakes'
import {
  useMyPendingRewards,
  useMyClaimedRewards,
} from './myRewards'

let context

const createDataRoot = () => {
  context = createContext()

  context.displayName = "Data Provider"
  const Provider = context.Provider

  const makeDecimals = decimals => {
    return `0,0.[${Array(decimals).fill(0)}]`
  }

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

    const myStakeUsdc = useMyStakeUsdc(liquidityMining)
    const myStakeUsdt = useMyStakeUsdt(liquidityMining)
    const myStakeDai = useMyStakeDai(liquidityMining)

    const myPendingRewards = useMyPendingRewards(liquidityMining, currentBlock)
    const myClaimedRewards = useMyClaimedRewards(liquidityMining)

    const dataContext = {
      totalRewards: numeral(utils.formatUnits(totalRewards, decimalsSarco)).format(makeDecimals(decimalsSarco)),
      totalClaimedRewards: numeral(utils.formatUnits(totalClaimedRewards, decimalsSarco)).format(makeDecimals(decimalsSarco)),
      rewardsPerBlock: numeral(utils.formatUnits(rewardsPerBlock, decimalsSarco)).format(makeDecimals(decimalsSarco)),
      
      totalStakeUsdc: numeral(utils.formatUnits(totalStakeUsdc, decimalsUsdc)).format(makeDecimals(decimalsUsdc)),
      totalStakeUsdt: numeral(utils.formatUnits(totalStakeUsdt, decimalsUsdt)).format(makeDecimals(decimalsUsdt)),
      totalStakeDai: numeral(utils.formatUnits(totalStakeDai, decimalsDai)).format(makeDecimals(decimalsDai)),
      totalStakeStablecoins: numeral(
        numeral(utils.formatUnits(totalStakeUsdc, decimalsUsdc)).value() +
        numeral(utils.formatUnits(totalStakeUsdt, decimalsUsdt)).value() +
        numeral(utils.formatUnits(totalStakeDai, decimalsDai)).value()
      ).format(`0,0.[${Array(decimalsDai).fill(0)}]`),

      currentBlock: numeral(currentBlock.toString()).format(),
      startBlock: numeral(startBlock.toString()).format(),
      firstStakeBlock: numeral(firstStakeBlock.toString()).format(),
      endingBlock: numeral(firstStakeBlock.add(blockLength).toString()).format(),
      blocksUntilKickoff: numeral(startBlock.sub(currentBlock).toString()).format(),
      remainingBlocks: numeral(firstStakeBlock.add(blockLength).sub(currentBlock).toString()).format(),

      myStakeUsdc: numeral(utils.formatUnits(myStakeUsdc, decimalsUsdc)).format(makeDecimals(decimalsUsdc)),
      myStakeUsdt: numeral(utils.formatUnits(myStakeUsdt, decimalsUsdt)).format(makeDecimals(decimalsUsdt)),
      myStakeDai: numeral(utils.formatUnits(myStakeDai, decimalsDai)).format(makeDecimals(decimalsDai)),
      myStakedStablecoins: numeral(
        numeral(utils.formatUnits(myStakeUsdc, decimalsUsdc)).value() + 
        numeral(utils.formatUnits(myStakeUsdt, decimalsUsdt)).value() +
        numeral(utils.formatUnits(myStakeDai, decimalsDai)).value()
      ).format(`0,0.[${Array(decimalsDai).fill(0)}]`),

      myPendingRewards: numeral(utils.formatUnits(myPendingRewards, decimalsSarco)).format(makeDecimals(decimalsSarco)),
      myClaimedRewards: numeral(utils.formatUnits(myClaimedRewards, decimalsSarco)).format(makeDecimals(decimalsSarco)),
      myTotalRewards: numeral(utils.formatUnits(myPendingRewards.add(myClaimedRewards), decimalsSarco)).format(makeDecimals(decimalsSarco)),
    }

    return <Provider value={dataContext}>{children}</Provider>
  }
}

const DataProvider = createDataRoot()

const useData = () => {
  return useContext(context)
}

export { DataProvider, useData }