import { useState, useEffect } from 'react'
import { BigNumber } from 'ethers'
import { useWeb3 } from '../web3'

const useMyUsdcBalance = (usdcContract, currentTime) => {
  const { account } = useWeb3()
  const [balance, setBalance] = useState(BigNumber.from(0))

  useEffect(() => {
    if (!account || !usdcContract) return

    usdcContract.balanceOf(account).then(balance => {
      setBalance(balance)
    }).catch(error => console.error(error))
  }, [account, usdcContract, currentTime])

  return balance
}

const useMyUsdtBalance = (usdtContract, currentTime) => {
  const { account } = useWeb3()
  const [balance, setBalance] = useState(BigNumber.from(0))

  useEffect(() => {
    if (!account || !usdtContract) return

    usdtContract.balanceOf(account).then(balance => {
      setBalance(balance)
    }).catch(error => console.error(error))
  }, [account, usdtContract, currentTime])

  return balance
}

const useMyDaiBalance = (daiContract, currentTime) => {
  const { account } = useWeb3()
  const [balance, setBalance] = useState(BigNumber.from(0))

  useEffect(() => {
    if (!account || !daiContract) return

    daiContract.balanceOf(account).then(balance => {
      setBalance(balance)
    }).catch(error => console.error(error))
  }, [account, daiContract, currentTime])

  return balance
}

const useMyUsdcAllowance = (liquidityMining, usdcContract, currentTime) => {
  const { account } = useWeb3()
  const [allowance, setAllowance] = useState(BigNumber.from(0))

  useEffect(() => {
    if (!account || !liquidityMining || !usdcContract) return

    usdcContract.allowance(account, liquidityMining.address).then(allowance => {
      setAllowance(allowance)
    }).catch(error => console.error(error))
  }, [account, liquidityMining, usdcContract, currentTime])

  return allowance
}

const useMyUsdtAllowance = (liquidityMining, usdtContract, currentTime) => {
  const { account } = useWeb3()
  const [allowance, setAllowance] = useState(BigNumber.from(0))

  useEffect(() => {
    if (!account || !liquidityMining || !usdtContract) return

    usdtContract.allowance(account, liquidityMining.address).then(allowance => {
      setAllowance(allowance)
    }).catch(error => console.error(error))
  }, [account, liquidityMining, usdtContract, currentTime])

  return allowance
}

const useMyDaiAllowance = (liquidityMining, daiContract, currentTime) => {
  const { account } = useWeb3()
  const [allowance, setAllowance] = useState(BigNumber.from(0))

  useEffect(() => {
    if (!account || !liquidityMining || !daiContract) return

    daiContract.allowance(account, liquidityMining.address).then(allowance => {
      setAllowance(allowance)
    }).catch(error => console.error(error))
  }, [account, liquidityMining, daiContract, currentTime])

  return allowance
}

export {
  useMyUsdcBalance,
  useMyUsdtBalance,
  useMyDaiBalance,
  useMyUsdcAllowance,
  useMyUsdtAllowance,
  useMyDaiAllowance,
}
