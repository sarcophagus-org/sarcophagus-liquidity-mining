import { useEffect } from 'react'
import { toast } from 'react-toastify'
import { useWeb3React, UnsupportedChainIdError } from '@web3-react/core'
import { InjectedConnector, NoEthereumProviderError, UserRejectedRequestError } from '@web3-react/injected-connector'
import { supportedChains, supportedChain } from './chains'

const injected = new InjectedConnector({ supportedChainIds: supportedChains() })

const useInactiveListener = () => {
  const { activate, chainId } = useWeb3React("injected")

  useEffect(() => {
    const { ethereum } = window
    if (!ethereum || !ethereum.on) return
    console.log("starting injected listeners")

    const handleChainChanged = (chainId) => {
      if (!supportedChain(parseInt(chainId))) return
      
      injected.isAuthorized().then(isAuthorized => {
        if (isAuthorized) {
          activate(injected)
        }
      })  
    }
    
    ethereum.on('chainChanged', handleChainChanged)
    
    return () => {
      console.log("removing injected listeners")
      if (ethereum.removeListener) {
        ethereum.removeListener('chainChanged', handleChainChanged)
      }
    }
  }, [activate, chainId])
}

const useInjectedConnect = () => {
  const web3React = useWeb3React("injected")
  const { active, activate, chainId, setError } = web3React

  useInactiveListener()

  useEffect(() => {
    if (active) return
    console.log("checking injected authorization")

    injected.isAuthorized().then((isAuthorized) => {
      if (!isAuthorized) {
        return
      }

      console.log("activating injected connection")
      activate(injected, undefined, true).catch(error => {
        if (error instanceof UnsupportedChainIdError) {
          toast("Switch MetaMask to a supported network!", {
            toastId: "switchToSupported"
          })
        }
      })
    })
  }, [active, activate, chainId, setError])

  return web3React
}

const manuallyConnect = (web3) => {
  web3.activate(injected, undefined, true).catch(error => {
    if (error instanceof NoEthereumProviderError) {
      toast("Install MetaMask to interact!", {
        toastId: "installMetaMask"
      })
    }

    if (error instanceof UserRejectedRequestError) {
      toast("Connect your MetaMask account to interact!", {
        toastId: "connectMetaMask"
      })
    }

    if (error instanceof UnsupportedChainIdError) {
      toast("Switch MetaMask to a supported network!", {
        toastId: "switchToSupported"
      })
    }
  })
}

export { injected, useInjectedConnect, manuallyConnect }