import { useState, useEffect } from 'react'
import { Contract } from 'ethers'
import { useWeb3 } from '../web3'
import { useAddresses } from '../web3/chains'
import LiquidityMining from "../../build-contracts/LiquidityMining.json"
import ERC20 from "../../build-contracts/ERC20.json"

const useLiquidityMiningContract = () => {
  const { web3, signerOrProvider } = useWeb3()
  const addresses = useAddresses(web3?.chainId)
  const [liquidityMiningContract, setLiquidityMiningContract] = useState()

  useEffect(() => {
    if (!web3 || !addresses) return

    setLiquidityMiningContract(new Contract(addresses.liquidityMining, LiquidityMining.abi, signerOrProvider))
  }, [web3, signerOrProvider, addresses])

  return liquidityMiningContract
}

const useUsdcContract = (liquidityMining) => {
  const { signerOrProvider } = useWeb3()
  const [usdcContract, setUsdcContract] = useState()

  useEffect(() => {
    if (!liquidityMining) return

    liquidityMining.usdc().then(usdc => {
      setUsdcContract(new Contract(usdc, ERC20.abi, signerOrProvider))
    })
  }, [liquidityMining, signerOrProvider])

  return usdcContract
}

const useUsdtContract = (liquidityMining) => {
  const { signerOrProvider } = useWeb3()
  const [usdtContract, setUsdtContract] = useState()

  useEffect(() => {
    if (!liquidityMining) return

    liquidityMining.usdt().then(usdt => {
      setUsdtContract(new Contract(usdt, ERC20.abi, signerOrProvider))
    })
  }, [liquidityMining, signerOrProvider])

  return usdtContract
}

const useDaiContract = (liquidityMining) => {
  const { signerOrProvider } = useWeb3()
  const [daiContract, setDaiContract] = useState()

  useEffect(() => {
    if (!liquidityMining) return

    liquidityMining.dai().then(dai => {
      setDaiContract(new Contract(dai, ERC20.abi, signerOrProvider))
    })
  }, [liquidityMining, signerOrProvider])

  return daiContract
}

const useSarcoContract = (liquidityMining) => {
  const { signerOrProvider } = useWeb3()
  const [sarcoContract, setSarcoContract] = useState()

  useEffect(() => {
    if (!liquidityMining) return

    liquidityMining.sarco().then(sarco => {
      setSarcoContract(new Contract(sarco, ERC20.abi, signerOrProvider))
    })
  }, [liquidityMining, signerOrProvider])

  return sarcoContract
}

const useDecimals = (contract) => {
  const [decimals, setDecimals] = useState(0)

  useEffect(() => {
    if (!contract) return

    contract.decimals().then(decimals => {
      setDecimals(decimals)
    })
  }, [contract])

  return decimals
}

export {
  useLiquidityMiningContract,
  useUsdcContract,
  useUsdtContract,
  useDaiContract,
  useSarcoContract,
  useDecimals
}