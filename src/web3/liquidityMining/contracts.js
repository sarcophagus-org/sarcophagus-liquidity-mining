import { useState, useEffect } from 'react'
import { Contract } from 'ethers'
import { useWeb3 } from '..'
import { useAddresses } from '../chains'
import LiquidityMining from "../../../build-contracts/LiquidityMining.json"
import ERC20 from "../../../build-contracts/ERC20.json"

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

const useUsdcContract = () => {
  const { signerOrProvider } = useWeb3()
  const liquidityMining = useLiquidityMiningContract()
  const [usdcContract, setUsdcContract] = useState()

  useEffect(() => {
    if (!liquidityMining) return

    liquidityMining.usdc().then(usdc => {
      setUsdcContract(new Contract(usdc, ERC20.abi, signerOrProvider))
    })
  }, [liquidityMining, signerOrProvider])

  return usdcContract
}

const useUsdtContract = () => {
  const { signerOrProvider } = useWeb3()
  const liquidityMining = useLiquidityMiningContract()
  const [usdtContract, setUsdtContract] = useState()

  useEffect(() => {
    if (!liquidityMining) return

    liquidityMining.usdt().then(usdt => {
      setUsdtContract(new Contract(usdt, ERC20.abi, signerOrProvider))
    })
  }, [liquidityMining, signerOrProvider])

  return usdtContract
}

const useDaiContract = () => {
  const { signerOrProvider } = useWeb3()
  const liquidityMining = useLiquidityMiningContract()
  const [daiContract, setDaiContract] = useState()

  useEffect(() => {
    if (!liquidityMining) return

    liquidityMining.dai().then(dai => {
      setDaiContract(new Contract(dai, ERC20.abi, signerOrProvider))
    })
  }, [liquidityMining, signerOrProvider])

  return daiContract
}

const useSarcoContract = () => {
  const { signerOrProvider } = useWeb3()
  const liquidityMining = useLiquidityMiningContract()
  const [sarcoContract, setSarcoContract] = useState()

  useEffect(() => {
    if (!liquidityMining) return

    liquidityMining.sarco().then(sarco => {
      setSarcoContract(new Contract(sarco, ERC20.abi, signerOrProvider))
    })
  }, [liquidityMining, signerOrProvider])

  return sarcoContract
}

export {
  useLiquidityMiningContract,
  useUsdcContract,
  useUsdtContract,
  useDaiContract,
  useSarcoContract
}