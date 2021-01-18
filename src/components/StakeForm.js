import { useState, useEffect, useCallback } from 'react'
import { BigNumber, utils } from 'ethers'
import numeral from 'numeral'
import { useData } from '../dataContext'
import { useTransaction } from '../dataContext/transactions'
import { useWeb3 } from '../web3'
import { Button } from './shared/Button'
import usdcIcon from '../assets/images/usdc.svg'
import usdtIcon from '../assets/images/usdt.svg'
import daiIcon from '../assets/images/dai.svg'
import lock from '../assets/images/lock.svg'

const StakeForm = () => {
  const { account } = useWeb3()
  const {
    liquidityMining,
    usdcContract,
    usdtContract,
    daiContract,
    myUsdcBalance,
    myUsdtBalance,
    myDaiBalance,
    myUsdcAllowance,
    myUsdtAllowance,
    myDaiAllowance,
    decimalsUsdc,
    decimalsUsdt,
    decimalsDai,
    canStake,
  } = useData()

  const [usdc, setUsdc] = useState(0)
  const [usdt, setUsdt] = useState(0)
  const [dai, setDai] = useState(0)

  const [usdcBig, setUsdcBig] = useState(BigNumber.from(0))
  const [usdtBig, setUsdtBig] = useState(BigNumber.from(0))
  const [daiBig, setDaiBig] = useState(BigNumber.from(0))

  const [buttonText, setButtonText] = useState("Stake")
  const { contractCall, pending } = useTransaction()
  const [callData, setCallData] = useState([])

  const [buttonEnabled, setButtonEnabled] = useState(false)

  useEffect(() => {
    setButtonEnabled(!pending && (usdcBig.gt(0) || usdtBig.gt(0) || daiBig.gt(0)))
  }, [pending, usdcBig, usdtBig, daiBig])

  useEffect(() => {
    setUsdc(0)
    setUsdt(0)
    setDai(0)
  }, [account])

  useEffect(() => {
    setUsdcBig(utils.parseUnits((usdc || 0).toFixed(decimalsUsdc), decimalsUsdc))
  }, [usdc, decimalsUsdc])

  useEffect(() => {
    setUsdtBig(utils.parseUnits((usdt || 0).toFixed(decimalsUsdt), decimalsUsdt))
  }, [usdt, decimalsUsdt])

  useEffect(() => {
    setDaiBig(utils.parseUnits((dai || 0).toFixed(decimalsDai), decimalsDai))
  }, [dai, decimalsDai])

  useEffect(() => {
    if (myUsdcAllowance.lt(usdcBig)) {
      setButtonText("Approve USDC")
      if (!usdcContract) return
      setCallData([
        usdcContract.approve,
        [liquidityMining?.address, BigNumber.from(2).pow(BigNumber.from(256)).sub(BigNumber.from(1))],
        "Approving USDC...", "USDC approval failed!", "USDC approval made!"
      ])
    } else if (myUsdtAllowance.lt(usdtBig)) {
      setButtonText("Approve USDT")
      if (!usdtContract) return
      setCallData([
        usdtContract.approve,
        [liquidityMining?.address, BigNumber.from(2).pow(BigNumber.from(256)).sub(BigNumber.from(1))],
        "Approving USDT...", "USDT approval failed!", "USDT approval made!"
      ])
    } else if (myDaiAllowance.lt(daiBig)) {
      setButtonText("Approve DAI")
      if (!daiContract) return
      setCallData([
        daiContract.approve,
        [liquidityMining?.address, BigNumber.from(2).pow(BigNumber.from(256)).sub(BigNumber.from(1))],
        "Approving DAI...", "DAI approval failed!", "DAI approval made!"
      ])
    } else {
      setButtonText("Lock my Stablecoins")
      if (!liquidityMining) return
      setCallData([
        liquidityMining.stake,
        [usdcBig, usdtBig, daiBig, { }],
        "Locking coins...", "Lock failed!", "Lock made!",
        () => {
          setUsdc(0)
          setUsdt(0)
          setDai(0)
        }
      ])
    }
  }, [usdc, usdt, dai, usdcBig, usdtBig, daiBig, myUsdcAllowance, myUsdtAllowance, myDaiAllowance, liquidityMining, usdcContract, usdtContract, daiContract])

  const calls = e => {
    e.preventDefault()
    contractCall(...callData)
  }

  const Input = useCallback(({ currency, value, setValue, balance, decimals, icon }) => {
    const calculateValue = setValue => {
      return e => {
        let normalizedValue = ""
        const inputValue = e.target.value
        if (inputValue) normalizedValue = Math.min(inputValue, numeral(balance).value())
        setValue(normalizedValue)
      }
    }

    const makeStep = decimals => {
      return `0.${Array(decimals).fill(0).join('')}`.slice(0, -1) + '1'
    }

    const inputDisable = !(canStake && numeral(balance).value() > 0)

    return (
      <div className="flex mb-4 text-sm">
        <div className="mr-4 flex flex-col items-center w-10">
          <div className="uppercase mb-2">{currency}</div>
          <div>
            <img src={icon} alt="icon" />
          </div>
        </div>
        <div className="w-full">
          <div className="flex justify-between mb-2 text-gray-400">
            <div className="mr-2">Amount*</div>
            <div>Balance: {balance}</div>
          </div>
          <input type="number" step={makeStep(decimals)} disabled={inputDisable} required name={currency} id={currency} value={value} onChange={calculateValue(setValue)} min="0" max={balance} className={`w-full border-2 border-gray-500 ${inputDisable ? 'text-gray-400' : 'text-white'} bg-gray-900`} placeholder={balance} />
        </div>
      </div>
    )
  }, [canStake])

  return (
    <div>
      <form onSubmit={calls}>
        <div className="mt-2 flex flex-col w-full">
          <Input currency="usdc" value={usdc} setValue={setUsdc} balance={myUsdcBalance} decimals={decimalsUsdc} icon={usdcIcon} />
          <Input currency="usdt" value={usdt} setValue={setUsdt} balance={myUsdtBalance} decimals={decimalsUsdt} icon={usdtIcon} />
          <Input currency="dai" value={dai} setValue={setDai} balance={myDaiBalance} decimals={6} icon={daiIcon} />
        </div>
        <div className="mx-6">
          <div className="mb-4 text-center text-gray-400 text-2xs">
            Please see the documentation below for more info.
          </div>
          <Button type="submit" disabled={!buttonEnabled} icon={lock}>
            {buttonText}
          </Button>
        </div>
      </form>
    </div>
  )
}

export default StakeForm
