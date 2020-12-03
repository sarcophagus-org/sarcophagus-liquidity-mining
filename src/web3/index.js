import { useEffect, useState } from 'react'
import { useNetworkConnect } from './network'
import { useInjectedConnect } from './injected'
import { supportedChain } from './chains'

const useWeb3 = () => {
  const network = useNetworkConnect()
  const injected = useInjectedConnect()

  const defaultName = "Not connected"
  const [name, setName] = useState(defaultName)
  const [account, setAccount] = useState(false)
  const [chainId, setChainId] = useState(null)
  const [library, setLibrary] = useState(null)
  const [signerOrProvider, setSignerOrProvider] = useState(null)

  useEffect(() => {
    if (injected.active && injected.account && supportedChain(injected.chainId)) {
      setName("Injected provider")
      setAccount(injected.account)
      setChainId(injected.chainId)
      setLibrary(injected.library)
      setSignerOrProvider(injected.library.getSigner())
    } else if (network.active) {
      setName("Network provider")
      setAccount(false)
      setChainId(network.chainId)
      setLibrary(network.library)
      setSignerOrProvider(network.library)
    } else {
      setName(defaultName)
      setAccount(false)
      setLibrary(null)
      setSignerOrProvider(null)
    }
  }, [network, injected])

  return { name, account, chainId, library, signerOrProvider }
}

export { useWeb3 }