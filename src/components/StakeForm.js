import { useState, useCallback } from 'react'
import numeral from 'numeral'
import { useData } from '../dataContext'
import { useTransaction } from '../dataContext/transactions'

const StakeForm = () => {
  const [usdc, setUsdc] = useState("0")
  const [usdt, setUsdt] = useState("0")
  const [dai, setDai] = useState("0")

  const {
    liquidityMining,
    myUsdcBalance,
    myUsdtBalance,
    myDaiBalance
  } = useData()

  const { contractCall, pending } = useTransaction(
    liquidityMining?.stake,
    [usdc, usdt, dai],
    "Making stake...", "Stake failed!", "Stake made!"
  )

  const stake = e => {
    e.preventDefault()
    contractCall()
  }

  const Input = useCallback(({ currency, value, setValue, balance }) => {
    return (
      <div className="flex rounded-md mb-2">
        <span className="uppercase inline-flex items-center justify-start px-2 w-14 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-sm">
          {currency}
        </span>
        <input type="number" disabled={pending} required name={currency} id={currency} value={value} onChange={e => setValue(e.target.value ? Math.min(e.target.value, numeral(balance).value()) : "")} min="0" max={balance} className="flex-1 block w-full rounded-none rounded-r-md sm:text-sm border-gray-300" placeholder={balance} />
      </div>
    )
  }, [pending])

  return (
    <div>
      <div className="text-xl">Make a Stake</div>
      <form onSubmit={stake}>
        <div className="mt-2 flex flex-col">
          <Input currency="usdc" value={usdc} setValue={setUsdc} balance={myUsdcBalance} />
          <Input currency="usdt" value={usdt} setValue={setUsdt} balance={myUsdtBalance} />
          <Input currency="dai" value={dai} setValue={setDai} balance={myDaiBalance} />
        </div>
        <div className="text-right">
          <button type="submit" disabled={pending} className="bg-gray-400 inline-flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white">
            Stake
          </button>
        </div>
      </form>
    </div>
  )
}

export default StakeForm
