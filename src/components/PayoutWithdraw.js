import { useState, useEffect } from 'react'
import { useData } from '../dataContext'
import { useTransaction } from '../dataContext/transactions'

const PayoutWithdraw = () => {
  const {
    liquidityMining,
    canPayout,
    canWithdraw,
  } = useData()

  const { contractCall, pending } = useTransaction()

  const [withdrawButtonText, setWithdrawButtonText] = useState("Withdraw")

  const [payoutEnabled, setPayoutEnabled] = useState(false)
  const [withdrawEnabled, setWithdrawEnabled] = useState(false)

  useEffect(() => {
    if (canPayout) {
      setWithdrawButtonText("Payout & Withdraw")
    } else {
      setWithdrawButtonText("Withdraw")
    }
  }, [canPayout])

  useEffect(() => {
    setPayoutEnabled(!pending && canPayout)
    setWithdrawEnabled(!pending && canWithdraw)
  }, [pending, canPayout, canWithdraw])

  const payout = () => {
    contractCall(
      liquidityMining.payout, [],
      "Paying out rewards...", "Payout failed!", "Payout successful!"
    )
  }

  const withdraw = () => {
    contractCall(
      liquidityMining.withdraw, [],
      "Withdrawing stake...", "Withdraw failed!", "Withdraw successful!"
    )
  }

  return (
    <div className="w-60">
      <div className="mb-4">
        <div className="text-xl">Payout My Rewards</div>
        <div className="">
          <button disabled={!payoutEnabled} onClick={payout} className={`bg-gray-400 inline-flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white ${!payoutEnabled && "opacity-50 cursor-not-allowed"}`}>
            Payout
          </button>
        </div>
      </div>
      <div>
        <div className="text-xl">Withdraw My Stakes</div>
        <div className="">
          <button disabled={!withdrawEnabled} onClick={withdraw} className={`bg-gray-400 inline-flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white ${!withdrawEnabled && "opacity-50 cursor-not-allowed"}`}>
            {withdrawButtonText}
          </button>
        </div>
      </div>
    </div>
  )
}

export default PayoutWithdraw
