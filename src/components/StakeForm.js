import { useState, useEffect, useCallback } from 'react'
import { BigNumber, utils } from 'ethers'
import numeral from 'numeral'
import { useData } from '../dataContext'
import { useTransaction } from '../dataContext/transactions'

const StakeForm = () => {
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
  const [canStake, setCanStake] = useState(false)

  useEffect(() => {
    setCanStake(!pending && (usdcBig.gt(0) || usdtBig.gt(0) || daiBig.gt(0)))
  }, [pending, usdcBig, usdtBig, daiBig])

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
      setButtonText("Stake")
      if (!liquidityMining) return
      setCallData([
        liquidityMining.stake,
        [usdcBig, usdtBig, daiBig],
        "Making stake...", "Stake failed!", "Stake made!",
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

  const Input = useCallback(({ currency, value, setValue, balance, decimals }) => {
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

    return (
      <div className="flex rounded-md mb-2">
        <span className="uppercase inline-flex items-center justify-start px-2 w-14 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-sm">
          {currency}
        </span>
        <input type="number" step={makeStep(decimals)} disabled={pending} required name={currency} id={currency} value={value} onChange={calculateValue(setValue)} min="0" max={balance} className="flex-1 block w-full rounded-none rounded-r-md sm:text-sm border-gray-300" placeholder={balance} />
      </div>
    )
  }, [pending])

  return (
    <div>
      <div className="text-xl">Make a Stake</div>
      <form onSubmit={calls}>
        <div className="mt-2 flex flex-col">
          <Input currency="usdc" value={usdc} setValue={setUsdc} balance={myUsdcBalance} decimals={decimalsUsdc} />
          <Input currency="usdt" value={usdt} setValue={setUsdt} balance={myUsdtBalance} decimals={decimalsUsdt} />
          <Input currency="dai" value={dai} setValue={setDai} balance={myDaiBalance} decimals={decimalsDai} />
        </div>
        <div className="text-right">
          <button type="submit" disabled={!canStake} className={`bg-gray-400 inline-flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white ${!canStake && "opacity-50 cursor-not-allowed"}`}>
            {buttonText}
          </button>
        </div>
      </form>
    </div>
  )
}

export default StakeForm
