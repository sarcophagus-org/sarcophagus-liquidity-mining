import { useState, useEffect } from 'react'
import { useData } from '../dataContext'
import { Row } from './shared/Value'
import { Button } from './shared/Button'
import { useWeb3 } from '../web3'
import { useTransaction } from '../dataContext/transactions'
import unlock from '../assets/images/unlock.svg'

const Unlock = () => {
  const { account } = useWeb3()
  const {
    myStakeUsdc,
    myStakeUsdt,
    myStakeDai,
    myStakedStablecoins,
    liquidityMining,
    canPayout,
    canWithdraw,
  } = useData()

  const { contractCall, pending } = useTransaction()

  const [withdrawEnabled, setWithdrawEnabled] = useState(false)

  useEffect(() => {
    setWithdrawEnabled(!pending && canWithdraw)
  }, [pending, canPayout, canWithdraw])

  const withdraw = () => {
    contractCall(
      liquidityMining.withdraw, [account, { }],
      "Unlocking stablecoins...", "Unlock failed!", "Unlock successful!"
    )
  }

  return (
    <div>
      <div className="mx-4 mb-4">
        <Row value={myStakeUsdc}>USDC Locked</Row>
        <Row value={myStakeUsdt}>USDT Locked</Row>
        <Row value={myStakeDai}>DAI Locked</Row>
        <Row value={myStakedStablecoins} total>Total Locked</Row>
      </div>
      <Button disabled={!withdrawEnabled} onClick={withdraw} icon={unlock}>
        Unlock my Stablecoins
      </Button>
    </div>
  )
}

export default Unlock
