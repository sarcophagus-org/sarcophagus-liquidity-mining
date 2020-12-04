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
    })
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
    })
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
    })
  }, [account, daiContract, currentBlock])

  return balance
}

export {
  useMyUsdcBalance,
  useMyUsdtBalance,
  useMyDaiBalance
}
