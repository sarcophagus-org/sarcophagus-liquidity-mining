import { useState, useEffect } from 'react'
import { getDefaultProvider } from 'ethers'

const useFallbackConnect = (previousProvider) => {
  const [provider, setProvider] = useState(null)
  const [defaultProvider] = useState(getDefaultProvider(parseInt(process.env.REACT_APP_CHAINID, 10), {
    alchemy: 'bjrgvDbGZBUJ_iZFFd1vIqUWzgrwKWeg',
    etherscan: 'G61W8715WK65NCMJPFXU8EBQ5VDTT4KCVJ',
    infura: '800746c8737e4f34bb772ade4532ab83',
  }))

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
