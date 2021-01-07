import { createContext, useContext, useState, useEffect } from 'react'
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
  useCurrentBlock,
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
  useMyRewardsPerTime,
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

  const counterString = seconds => {
    seconds = Number(seconds)
    var d = Math.floor(seconds / (3600 * 24))
    var h = Math.floor(seconds % (3600 * 24) / 3600)
    var m = Math.floor(seconds % 3600 / 60)
    var s = Math.floor(seconds % 60)

    var dDisplay = d > 0 ? d + (d === 1 ? " day, " : " days, ") : ""
    var hDisplay = h > 0 ? h + (h === 1 ? " hour, " : " hours, ") : ""
    var mDisplay = m > 0 ? m + (m === 1 ? " minute, " : " minutes, ") : ""
    var sDisplay = s > 0 ? s + (s === 1 ? " second" : " seconds") : ""

    if (!dDisplay && !hDisplay && !mDisplay && !sDisplay) sDisplay = "0 seconds"

    return (dDisplay + hDisplay + mDisplay + sDisplay).replace(/,\s*$/, "")
  }

  const dateString = seconds => {
    return new Date(seconds * 1000).toLocaleString()
  }

  const getDecimalNumber = (bigNumber, decimals) => {
    return makeNumeral(bigNumber, decimals).value()
  }

  const StateEnum = Object.freeze({
    NotScheduled: 1,
    Scheduled: 2,
    Ready: 3,
    Active: 4,
    Over: 5,
  })

  const useSystemState = (startTime, timeUntilKickoff, firstStakeTime, remainingTime) => {
    const [state, setState] = useState(StateEnum.NotScheduled)

    useEffect(() => {
      if (startTime.eq(0)) {
        setState(StateEnum.NotScheduled)
      } else if (timeUntilKickoff.gt(0)) {
        setState(StateEnum.Scheduled)
      } else if (firstStakeTime.eq(0)) {
        setState(StateEnum.Ready)
      } else if (remainingTime.gt(0)) {
        setState(StateEnum.Active)
      } else {
        setState(StateEnum.Over)
      }
    }, [startTime, timeUntilKickoff, firstStakeTime, remainingTime])

    return state
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
    const currentTime = useCurrentTime(currentBlock)
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

    const isActive = startTime.gt(0) && timeUntilKickoff.eq(0) && firstStakeTime.gt(0) && remainingTime.gt(0) && (myStakeUsdc.add(myStakeUsdt).add(myStakeDai).gt(0))
    const myRewardsPerTime = useMyRewardsPerTime(liquidityMining, currentBlock, rewardsPerTime, isActive)
    const myPendingRewards = useMyPendingRewards(liquidityMining, currentBlock, currentTime, myRewardsPerTime, isActive)
    const myClaimedRewards = useMyClaimedRewards(liquidityMining)

    const myTotalRewards = myPendingRewards.add(myClaimedRewards)

    const myUsdcBalance = useMyUsdcBalance(usdcContract, currentBlock)
    const myUsdtBalance = useMyUsdtBalance(usdtContract, currentBlock)
    const myDaiBalance = useMyDaiBalance(daiContract, currentBlock)

    const myUsdcAllowance = useMyUsdcAllowance(liquidityMining, usdcContract, currentBlock)
    const myUsdtAllowance = useMyUsdtAllowance(liquidityMining, usdtContract, currentBlock)
    const myDaiAllowance = useMyDaiAllowance(liquidityMining, daiContract, currentBlock)

    const systemState = useSystemState(startTime, timeUntilKickoff, firstStakeTime, remainingTime)

    const canStake = useCanStake(systemState, StateEnum)
    const canPayout = useCanPayout(myPendingRewards)
    const canWithdraw = useCanWithdraw(myStakeUsdc, myStakeUsdt, myStakeDai)

    const dataContext = {
      liquidityMining, usdcContract, usdtContract, daiContract, sarcoContract,
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

      currentTime: dateString(currentTime),
      startTime: dateString(startTime),
      firstStakeTime: dateString(firstStakeTime),
      endTime: dateString(endTime),
      timeUntilKickoff: counterString(timeUntilKickoff),
      remainingTime: counterString(remainingTime),

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
      myRewardsPerTime: moneyString(myRewardsPerTime, decimalsSarco),

      myUsdcBalance: moneyString(myUsdcBalance, decimalsUsdc),
      myUsdtBalance: moneyString(myUsdtBalance, decimalsUsdt),
      myDaiBalance: moneyString(myDaiBalance, decimalsDai),

      myUsdcAllowance,
      myUsdtAllowance,
      myDaiAllowance,

      canStake,
      canPayout,
      canWithdraw,

      systemState, StateEnum
    }

    return <Provider value={dataContext}>{children}</Provider>
  }
}

const DataProvider = createDataRoot()

const useData = () => {
  return useContext(context)
}

export { DataProvider, useData }