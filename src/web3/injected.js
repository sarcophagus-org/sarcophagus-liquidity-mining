import { useState, useEffect } from 'react'
import { toast } from 'react-toastify'
import { useWeb3React, UnsupportedChainIdError } from '@web3-react/core'
import { InjectedConnector, NoEthereumProviderError, UserRejectedRequestError } from '@web3-react/injected-connector'
import { supportedChains } from './chains'

const injectedConnector = new InjectedConnector({ supportedChainIds: supportedChains() })

const useInactiveListener = () => {
  const { activate, chainId } = useWeb3React()

  useEffect(() => {
    const { ethereum } = window
    if (!ethereum || !ethereum.on) return

    const handleChainChanged = (chainId) => {
      if (!supportedChains().includes(parseInt(chainId))) return

      injectedConnector.isAuthorized().then(isAuthorized => {
        if (isAuthorized) {
          activate(injectedConnector)
        }
      }).catch(console.error)
    }

    ethereum.on('chainChanged', handleChainChanged)

    return () => {
      if (ethereum.removeListener) {
        ethereum.removeListener('chainChanged', handleChainChanged)
      }
    }
  }, [activate, chainId])
}

const useInjectedConnect = () => {
  const injected = useWeb3React()
  const [injectedNext, setInjectedNext] = useState(false)

  const { active, activate, chainId, setError } = injected

  useInactiveListener()

  useEffect(() => {
    if (active) return

    injectedConnector.isAuthorized().then((isAuthorized) => {
      if (!isAuthorized) {
        setInjectedNext(true)
        return
      }

      activate(injectedConnector, undefined, true)
        .then(() => {
          setInjectedNext(true)
        }).catch(error => {
          setInjectedNext(true)
          if (error instanceof UnsupportedChainIdError) {
            toast.info('Switch MetaMask to a supported network!', {
              toastId: 'switchToSupported'
            })
          }
        })
    }).catch(error => {
      console.error(error)
      setInjectedNext(true)
    })
  }, [active, activate, chainId, setError])

  return { injected, injectedNext }
}

const manuallyConnect = (web3) => {
  web3.activate(injectedConnector, undefined, true).catch(error => {
    if (error instanceof NoEthereumProviderError) {
      toast.info('Install MetaMask to interact!', {
        toastId: 'installMetaMask'
      })
    }

    if (error instanceof UserRejectedRequestError) {
      toast.info('Connect your MetaMask account to interact!', {
        toastId: 'connectMetaMask'
      })
    }

    if (error instanceof UnsupportedChainIdError) {
      toast.info('Switch MetaMask to a supported network!', {
        toastId: 'switchToSupported'
      })
    }
  })
}

export { useInjectedConnect, manuallyConnect }