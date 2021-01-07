import { useState, useEffect } from 'react'
import { getDefaultProvider } from 'ethers'

const useFallbackConnect = (previousProvider) => {
  const [provider, setProvider] = useState(null)
  const [defaultProvider] = useState(getDefaultProvider(parseInt(process.env.REACT_APP_DEFAULT_CHAIN_ID, 10)))

  useEffect(() => {
    if (previousProvider) {
      setProvider(null)
      return
    }

    if (provider) {
      return
    }

    setProvider(defaultProvider)
  }, [provider, previousProvider, defaultProvider])

  return provider
}

export { useFallbackConnect }
