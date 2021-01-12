import { useState, useEffect } from 'react'

const supportedChains = () => {
  const dev = process.env.NODE_ENV !== 'production' ? [parseInt(process.env.REACT_APP_LOCAL_CHAINID, 10)] : []
  return [...dev, 1]
}

const useAddresses = chainId => {
  const [addresses, setAddresses] = useState()

  useEffect(() => {
    if (chainId === parseInt(process.env.REACT_APP_LOCAL_CHAINID, 10)) {
      setAddresses({
        liquidityMining: process.env.REACT_APP_LOCAL_LIQUIDITY_MINING_ADDRESS
      })
    } else if (chainId === 1) {
      setAddresses({
        liquidityMining: '0xF6eaD7c9Bc26b7641B7310EB7Ef6C2040f16ADEf'
      })
    }
  }, [chainId])

  return addresses
}

export {
  supportedChains,
  useAddresses
}