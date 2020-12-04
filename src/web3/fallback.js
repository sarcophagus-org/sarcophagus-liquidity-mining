import { useState, useEffect } from 'react'
import { getDefaultProvider } from 'ethers'

const useFallbackConnect = (pending) => {
  const [provider, setProvider] = useState(null)

  useEffect(() => {
    if (provider || pending) return

    setProvider(getDefaultProvider(parseInt(process.env.REACT_APP_DEFAULT_CHAIN_ID, 10)))      
  }, [provider, pending])

  return provider
}

export { useFallbackConnect }
