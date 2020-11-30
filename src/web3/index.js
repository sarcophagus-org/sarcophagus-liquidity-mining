import { useEffect, useState } from 'react'
import { useNetworkConnect } from './network'
import { useInjectedConnect } from './injected'
import { supportedChain } from './chains'

const useWeb3 = () => {
  const network = useNetworkConnect()
  const injected = useInjectedConnect()

  const defaultName = "Not connected"
  const [web3, setWeb3] = useState()
  const [name, setName] = useState(defaultName)
  const [account, setAccount] = useState(false)
  const [signerOrProvider, setSignerOrProvider] = useState(null)

  useEffect(() => {
    console.log("determining web3react provider")
    if (injected.active && injected.account && supportedChain(injected.chainId)) {
      console.log("using injected provider")
      setWeb3(injected)
      setName("Injected provider")
      setAccount(injected.account)
      setSignerOrProvider(injected.library.getSigner())
    } else if (network.active) {
      console.log("using network provider")
      setWeb3(network)
      setName("Network provider")
      setAccount(false)
      setSignerOrProvider(network.library)
    } else {
      console.log("using no provider")
      setWeb3()
      setName(defaultName)
      setAccount(false)
      setSignerOrProvider(null)
    }
  }, [network, injected])

  return { web3, name, account, signerOrProvider }
}

export { useWeb3 }