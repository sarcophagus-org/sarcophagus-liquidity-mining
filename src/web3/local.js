import { useState, useEffect } from 'react'
import { ethers } from 'ethers'

const useLocalConnect = () => {
  const [provider, setProvider] = useState(null)
  const [pending, setPending] = useState(true)

  useEffect(() => {
    if (provider || process.env.NODE_ENV === "production") return

    const _provider = new ethers.providers.JsonRpcProvider(process.env.REACT_APP_LOCAL_PROVIDER_URL)
    _provider.detectNetwork()
      .then(() => {
        setProvider(_provider)
      })
      .catch(() => {
        setPending(false)
        setProvider(null)
      })
  }, [provider])

  return { local: provider, pending }
}

export { useLocalConnect }
