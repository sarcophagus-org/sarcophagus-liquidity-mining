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
  useRewardsPerTime,
} from './totalRewards'
import {
  useCurrentTime,
  useStartTime,
  useFirstStakeTime,
  useEndTime,
  useElapsedTime,
  useRemainingTime,
  useTimeUntilKickoff,
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
  useMyUsdcAllowance,
  useMyUsdtAllowance,
  useMyDaiAllowance,
} from './myBalances'
import {
  useCanStake,
  useCanPayout,
  useCanWithdraw,
} from './abilities'

let context

const createDataRoot = () => {
  context = createContext()

  context.displayName = 'Data Provider'
  const Provider = context.Provider

  const makeDecimals = decimals => {
    return `0,0.[${Array(decimals).fill(0).join("")}]`
  }

  const makeNumeral = (bigNumber, decimals) => {
    return numeral(utils.formatUnits(bigNumber, decimals))
  }

  const moneyString = (bigNumber, decimals) => {
    const money = makeNumeral(bigNumber, decimals).format(makeDecimals(decimals))
    if (money === "NaN") return "0"
    return money
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

    const currentTime = useCurrentTime()
    const startTime = useStartTime(liquidityMining)
    const firstStakeTime = useFirstStakeTime(liquidityMining)
    const endTime = useEndTime(liquidityMining)
    const rewardsPerTime = useRewardsPerTime(totalRewards, startTime, firstStakeTime, endTime)

    const timeUntilKickoff = useTimeUntilKickoff(currentTime, startTime)

    const elapsedTime = useElapsedTime(currentTime, firstStakeTime, endTime)
    const remainingTime = useRemainingTime(firstStakeTime, elapsedTime, endTime)
    const totalEmittedRewards = elapsedTime.mul(rewardsPerTime)
    const totalUnemittedRewards = remainingTime.mul(rewardsPerTime)
    const totalUnclaimedRewards = totalEmittedRewards.sub(totalClaimedRewards)

    const myStakeUsdc = useMyStakeUsdc(liquidityMining)
    const myStakeUsdt = useMyStakeUsdt(liquidityMining)
    const myStakeDai = useMyStakeDai(liquidityMining)

    const myPendingRewards = useMyPendingRewards(liquidityMining, currentTime)
    const myClaimedRewards = useMyClaimedRewards(liquidityMining)

    const myTotalRewards = myPendingRewards.add(myClaimedRewards)

    const myUsdcBalance = useMyUsdcBalance(usdcContract, currentTime)
    const myUsdtBalance = useMyUsdtBalance(usdtContract, currentTime)
    const myDaiBalance = useMyDaiBalance(daiContract, currentTime)

    const myUsdcAllowance = useMyUsdcAllowance(liquidityMining, usdcContract, currentTime)
    const myUsdtAllowance = useMyUsdtAllowance(liquidityMining, usdtContract, currentTime)
    const myDaiAllowance = useMyDaiAllowance(liquidityMining, daiContract, currentTime)

    const canStake = useCanStake(timeUntilKickoff, startTime, endTime, firstStakeTime, remainingTime, currentTime)
    const canPayout = useCanPayout(myPendingRewards)
    const canWithdraw = useCanWithdraw(myStakeUsdc, myStakeUsdt, myStakeDai)

    const dataContext = {
      liquidityMining, usdcContract, usdtContract, daiContract,
      decimalsUsdc, decimalsUsdt, decimalsDai,

      totalRewards: moneyString(totalRewards, decimalsSarco),
      totalClaimedRewards: moneyString(totalClaimedRewards, decimalsSarco),
      rewardsPerTime: moneyString(rewardsPerTime, decimalsSarco),
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

      currentTime: blockString(currentTime),
      startTime: blockString(startTime),
      firstStakeTime: blockString(firstStakeTime),
      endTime: blockString(endTime),
      timeUntilKickoff: blockString(timeUntilKickoff),
      remainingTime: blockString(remainingTime),

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

      myUsdcAllowance,
      myUsdtAllowance,
      myDaiAllowance,

      canStake,
      canPayout,
      canWithdraw,
    }

    return <Provider value={dataContext}>{children}</Provider>
  }
}

const DataProvider = createDataRoot()

const useData = () => {
  return useContext(context)
}

export { DataProvider, useData }