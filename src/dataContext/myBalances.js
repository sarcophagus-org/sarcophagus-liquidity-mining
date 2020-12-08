import { useState, useEffect } from 'react'
import { BigNumber } from 'ethers'
import { useWeb3 } from '../web3'

const useMyUsdcBalance = (usdcContract, currentBlock) => {
  const { account } = useWeb3()
  const [balance, setBalance] = useState(BigNumber.from(0))

  useEffect(() => {
    if (!account || !usdcContract) return

    usdcContract.balanceOf(account).then(balance => {
      setBalance(balance)
    }).catch(console.error)
  }, [account, usdcContract, currentBlock])

  return balance
}

const useMyUsdtBalance = (usdtContract, currentBlock) => {
  const { account } = useWeb3()
  const [balance, setBalance] = useState(BigNumber.from(0))

  useEffect(() => {
    if (!account || !usdtContract) return

    usdtContract.balanceOf(account).then(balance => {
      setBalance(balance)
    }).catch(console.error)
  }, [account, usdtContract, currentBlock])

  return balance
}

const useMyDaiBalance = (daiContract, currentBlock) => {
  const { account } = useWeb3()
  const [balance, setBalance] = useState(BigNumber.from(0))

  useEffect(() => {
    if (!account || !daiContract) return

    daiContract.balanceOf(account).then(balance => {
      setBalance(balance)
    }).catch(console.error)
  }, [account, daiContract, currentBlock])

  return balance
}

const useMyUsdcAllowance = (liquidityMining, usdcContract, currentBlock) => {
  const { account } = useWeb3()
  const [allowance, setAllowance] = useState(BigNumber.from(0))

  useEffect(() => {
    if (!account || !liquidityMining || !usdcContract) return

    usdcContract.allowance(account, liquidityMining.address).then(allowance => {
      setAllowance(allowance)
    }).catch(console.error)
  }, [account, liquidityMining, usdcContract, currentBlock])

  return allowance
}

const useMyUsdtAllowance = (liquidityMining, usdtContract, currentBlock) => {
  const { account } = useWeb3()
  const [allowance, setAllowance] = useState(BigNumber.from(0))

  useEffect(() => {
    if (!account || !liquidityMining || !usdtContract) return

    usdtContract.allowance(account, liquidityMining.address).then(allowance => {
      setAllowance(allowance)
    }).catch(console.error)
  }, [account, liquidityMining, usdtContract, currentBlock])

  return allowance
}

const useMyDaiAllowance = (liquidityMining, daiContract, currentBlock) => {
  const { account } = useWeb3()
  const [allowance, setAllowance] = useState(BigNumber.from(0))

  useEffect(() => {
    if (!account || !liquidityMining || !daiContract) return

    daiContract.allowance(account, liquidityMining.address).then(allowance => {
      setAllowance(allowance)
    }).catch(console.error)
  }, [account, liquidityMining, daiContract, currentBlock])

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
