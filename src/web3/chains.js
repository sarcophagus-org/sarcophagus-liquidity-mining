import { useState, useEffect } from 'react'

const supportedChains = () => {
  const dev = process.env.NODE_ENV !== 'production' ? [parseInt(process.env.REACT_APP_LOCAL_CHAINID, 10)] : []
  return [...dev, parseInt(process.env.REACT_APP_CHAINID, 10)]
}

const useAddresses = chainId => {
  const [addresses, setAddresses] = useState()

  useEffect(() => {
    if (chainId === parseInt(process.env.REACT_APP_LOCAL_CHAINID, 10)) {
      setAddresses({
        liquidityMining: process.env.REACT_APP_LOCAL_LIQUIDITY_MINING_ADDRESS
      })
    } else {
      setAddresses({
        liquidityMining: process.env.REACT_APP_LIQUIDITY_MINING_ADDRESS
      })
    }
  }, [chainId])

  return addresses
}

export {
  supportedChains,
  useAddresses
}