import { useEffect, useState } from 'react'
import { useFallbackConnect } from './fallback'
import { useLocalConnect } from './local'
import { useInjectedConnect } from './injected'
import { supportedChains } from './chains'

const useWeb3 = () => {
  const { local, pending } = useLocalConnect()
  const fallback = useFallbackConnect(pending)
  const injected = useInjectedConnect()

  const defaultName = "Not connected"

  const [data, setData] = useState({
    name: defaultName,
    account: false,
    chainId: null,
    provider: null,
    signerOrProvider: null,
  })

  useEffect(() => {
    if (injected.active && injected.account && supportedChains().includes(injected.chainId)) {
      setData({
        name: "Injected provider",
        account: injected.account,
        chainId: injected.chainId,
        provider: injected.library,
        signerOrProvider: injected.library.getSigner(),
      })
    } else if (local) {
      local.detectNetwork().then(network => {
        setData({
          name: "Local provider",
          account: false,
          chainId: network.chainId,
          provider: local,
          signerOrProvider: local,
        })
      }).catch(error => console.error(error))
    } else if (fallback) {
      setData({
        name: "Fallback provider",
        account: false,
        chainId: fallback.network.chainId,
        provider: fallback,
        signerOrProvider: fallback,
      })
    } else {
      setData({
        name: defaultName,
        account: false,
        chainId: null,
        provider: null,
        signerOrProvider: null
      })
    }
  }, [fallback, local, injected])

  return { ...data }
}

export { useWeb3 }