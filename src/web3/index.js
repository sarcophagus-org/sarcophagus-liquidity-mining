import { useEffect, useState, createContext, useContext } from 'react'
import { useFallbackConnect } from './fallback'
import { useLocalConnect } from './local'
import { useInjectedConnect } from './injected'
import { supportedChains } from './chains'

let context

const createWeb3Root = () => {
  context = createContext()

  context.displayName = 'Web3 Provider'
  const Provider = context.Provider

  return ({ children }) => {
    const { injected, injectedNext } = useInjectedConnect()
    const { local, localNext } = useLocalConnect(injectedNext)
    const fallback = useFallbackConnect(localNext)

    const defaultName = 'Not connected'

    const [web3, setWeb3] = useState({
      name: defaultName,
      account: false,
      chainId: null,
      provider: null,
      signerOrProvider: null,
    })

    useEffect(() => {
      if (injected.active && injected.account && supportedChains().includes(injected.chainId)) {
        setWeb3({
          name: 'Injected provider',
          account: injected.account,
          chainId: injected.chainId,
          provider: injected.library,
          signerOrProvider: injected.library.getSigner(),
        })
      } else if (local) {
        local.detectNetwork().then(network => {
          setWeb3({
            name: 'Local provider',
            account: false,
            chainId: network.chainId,
            provider: local,
            signerOrProvider: local,
          })
        }).catch(console.error)
      } else if (fallback) {
        setWeb3({
          name: 'Fallback provider',
          account: false,
          chainId: fallback.network.chainId,
          provider: fallback,
          signerOrProvider: fallback,
        })
      } else {
        setWeb3({
          name: defaultName,
          account: false,
          chainId: null,
          provider: null,
          signerOrProvider: null
        })
      }
    }, [injected, local, fallback])

    return <Provider value={web3}>{children}</Provider>
  }
}

const Web3Provider = createWeb3Root()

const useWeb3 = () => {
  return useContext(context)
}

export { Web3Provider, useWeb3 }
