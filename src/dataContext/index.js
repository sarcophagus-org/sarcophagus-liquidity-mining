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
  useRewardsPerBlock,
} from './totalRewards'
import {
  useCurrentBlock,
  useStartBlock,
  useFirstStakeBlock,
  useBlockLength,
  useElapsedBlocks,
  useRemainingBlocks,
  useBlocksUntilKickoff,
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
import {
  useMyUsdcBalance,
  useMyUsdtBalance,
  useMyDaiBalance,
} from './myBalances'

let context

const createDataRoot = () => {
  context = createContext()

  context.displayName = 'Data Provider'
  const Provider = context.Provider

  const makeDecimals = decimals => {
    return `0,0.[${Array(decimals).fill(0)}]`
  }

  const makeNumeral = (bigNumber, decimals) => {
    return numeral(utils.formatUnits(bigNumber, decimals))
  }

  const moneyString = (bigNumber, decimals) => {
    return makeNumeral(bigNumber, decimals).format(makeDecimals(decimals))
  }

  const blockString = blockNum => {
    return numeral(blockNum.toString()).format()
  }

  const getDecimalNumber = (bigNumber, decimals) => {
    return makeNumeral(bigNumber, decimals).value()
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

    const blocksUntilKickoff = useBlocksUntilKickoff(currentBlock, startBlock)
    const endingBlock = firstStakeBlock.add(blockLength)

    const elapsedBlocks = useElapsedBlocks(currentBlock, firstStakeBlock, blockLength)
    const remainingBlocks = useRemainingBlocks(firstStakeBlock, elapsedBlocks, blockLength)
    const totalEmittedRewards = elapsedBlocks.mul(rewardsPerBlock)
    const totalUnemittedRewards = remainingBlocks.mul(rewardsPerBlock)
    const totalUnclaimedRewards = totalEmittedRewards.sub(totalClaimedRewards)

    const myStakeUsdc = useMyStakeUsdc(liquidityMining)
    const myStakeUsdt = useMyStakeUsdt(liquidityMining)
    const myStakeDai = useMyStakeDai(liquidityMining)

    const myPendingRewards = useMyPendingRewards(liquidityMining, currentBlock)
    const myClaimedRewards = useMyClaimedRewards(liquidityMining)

    const myTotalRewards = myPendingRewards.add(myClaimedRewards)

    const myUsdcBalance = useMyUsdcBalance(usdcContract, currentBlock)
    const myUsdtBalance = useMyUsdtBalance(usdtContract, currentBlock)
    const myDaiBalance = useMyDaiBalance(daiContract, currentBlock)

    const dataContext = {
      liquidityMining,

      totalRewards: moneyString(totalRewards, decimalsSarco),
      totalClaimedRewards: moneyString(totalClaimedRewards, decimalsSarco),
      rewardsPerBlock: moneyString(rewardsPerBlock, decimalsSarco),
      totalEmittedRewards: moneyString(totalEmittedRewards, decimalsSarco),
      totalUnemittedRewards: moneyString(totalUnemittedRewards, decimalsSarco),
      totalUnclaimedRewards: moneyString(totalUnclaimedRewards, decimalsSarco),

      totalStakeUsdc: moneyString(totalStakeUsdc, decimalsUsdc),
      totalStakeUsdt: moneyString(totalStakeUsdt, decimalsUsdt),
      totalStakeDai: moneyString(totalStakeDai, decimalsDai),
      totalStakeStablecoins: numeral(
        getDecimalNumber(totalStakeUsdc, decimalsUsdc) +
        getDecimalNumber(totalStakeUsdt, decimalsUsdt) +
        getDecimalNumber(totalStakeDai, decimalsDai)
      ).format(makeDecimals(decimalsDai)),

      currentBlock: blockString(currentBlock),
      startBlock: blockString(startBlock),
      firstStakeBlock: blockString(firstStakeBlock),
      endingBlock: blockString(endingBlock),
      blocksUntilKickoff: blockString(blocksUntilKickoff),
      remainingBlocks: blockString(remainingBlocks),

      myStakeUsdc: moneyString(myStakeUsdc, decimalsUsdc),
      myStakeUsdt: moneyString(myStakeUsdt, decimalsUsdt),
      myStakeDai: moneyString(myStakeDai, decimalsDai),
      myStakedStablecoins: numeral(
        getDecimalNumber(myStakeUsdc, decimalsUsdc) +
        getDecimalNumber(myStakeUsdt, decimalsUsdt) +
        getDecimalNumber(myStakeDai, decimalsDai)
      ).format(makeDecimals(decimalsDai)),

      myPendingRewards: moneyString(myPendingRewards, decimalsSarco),
      myClaimedRewards: moneyString(myClaimedRewards, decimalsSarco),
      myTotalRewards: moneyString(myTotalRewards, decimalsSarco),

      myUsdcBalance: moneyString(myUsdcBalance, decimalsUsdc),
      myUsdtBalance: moneyString(myUsdtBalance, decimalsUsdt),
      myDaiBalance: moneyString(myDaiBalance, decimalsDai),
    }

    return <Provider value={dataContext}>{children}</Provider>
  }
}

const DataProvider = createDataRoot()

const useData = () => {
  return useContext(context)
}

export { DataProvider, useData }