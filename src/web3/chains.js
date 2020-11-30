import { useState, useEffect } from 'react'

const supportedChains = () => {
  const dev = process.env.NODE_ENV !== "production" ? [1337, 5777] : []
  return [...dev]
}

const supportedChain = (chainId) => {
  return supportedChains().includes(chainId)
}

const chainJsonRpcUrls = () => {
  return {
    1337: "http://127.0.0.1:9545",
    5777: "http://127.0.0.1:9545",
  }
}

const useAddresses = chainId => {
  const [addresses, setAddresses] = useState()

  useEffect(() => {
    if (chainId === 1337 || chainId === 5777) {
      setAddresses({
        liquidityMining: process.env.REACT_APP_LOCAL_LIQUIDITY_MINING_ADDRESS
      })
    }
  }, [chainId])

  return addresses
}

export {
  chainJsonRpcUrls,
  supportedChains,
  supportedChain,
  useAddresses
}