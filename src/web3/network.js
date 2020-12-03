import { useEffect } from 'react'
import { useWeb3React } from '@web3-react/core'
import { NetworkConnector } from '@web3-react/network-connector'
import { chainJsonRpcUrls } from './chains'

const network = new NetworkConnector({
  urls: chainJsonRpcUrls(),
  defaultChainId: process.env.REACT_APP_DEFAULT_CHAIN_ID,
})

const useNetworkConnect = () => {
  const web3React = useWeb3React()
  const { active, activate } = web3React

  useEffect(() => {
    if (active) return

    activate(network)
  }, [active, activate])

  return web3React
}

export { useNetworkConnect }
