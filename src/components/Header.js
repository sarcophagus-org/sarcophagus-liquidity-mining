import { useState, useEffect } from 'react'
import { useInjectedConnect, manuallyConnect } from '../web3/injected'
import { useData } from '../dataContext'
import logo from '../assets/images/logo.png'
import wallet from '../assets/images/wallet.svg'

const AccountDisplay = ({ account }) => {
  const { injected } = useInjectedConnect()

  const truncate = (fullStr, strLen, separator) => {
    if (fullStr.length <= strLen) return fullStr;

    separator = separator || '...';

    const sepLen = separator.length
    const charsToShow = strLen - sepLen
    const frontChars = Math.ceil(charsToShow / 2 + 1) // accounts for the "0x"
    const backChars = Math.floor(charsToShow / 2 - 1) // accounts for the "0x"

    return fullStr.substr(0, frontChars) + separator + fullStr.substr(fullStr.length - backChars);
  }

  if (account) {
    return (
      <div>
        {truncate(account, 25)}
      </div>
    )
  } else {
    return (
      <button className="underline" onClick={() => manuallyConnect(injected)}>
        Connect Web3 Account
      </button>
    )
  }
}

const Top = () => {
  const { injected } = useInjectedConnect()

  return (
    <div className="flex justify-between mb-16">
      <img src={logo} alt="logo" />
      <div className="flex items-center">
        <div>
          <img src={wallet} alt="wallet" />
        </div>
        <div className="ml-3 text-gray-400 text-sm">
          <AccountDisplay account={injected.account} />
        </div>
      </div>
    </div>
  )
}

const Title = () => {
  const { systemState, StateEnum } = useData()

  const [liquidityMiningState, setLiquidityMiningState] = useState("Not Scheduled")
  const [badgeColor, setBadgeColor] = useState("bg-red")

  useEffect(() => {
    if (systemState === StateEnum.NotScheduled) {
      setLiquidityMiningState("Not Scheduled")
      setBadgeColor("bg-red")
    } else if (systemState === StateEnum.Scheduled) {
      setLiquidityMiningState("Scheduled")
      setBadgeColor("bg-yellow")
    } else if (systemState === StateEnum.Ready) {
      setLiquidityMiningState("Ready")
      setBadgeColor("bg-green")
    } else if (systemState === StateEnum.Active) {
      setLiquidityMiningState("Active")
      setBadgeColor("bg-green")
    } else if (systemState === StateEnum.Over) {
      setLiquidityMiningState("Over")
      setBadgeColor("bg-red")
    } else {
      setLiquidityMiningState("Not Scheduled")
      setBadgeColor("bg-red")
    }
  }, [systemState, StateEnum])

  return (
    <div className="flex justify-center items-center">
      <h1 className="text-xl">
        Liquidity Mining
      </h1>
      <div className={`ml-3 py-1 px-2 ${badgeColor} text-gray-900 text-xs rounded`}>
        {liquidityMiningState}
      </div>
    </div>
  )
}

const Header = () => {
  return (
    <div className="py-6">
      <Top />
      <Title />
    </div>
  )
}

export default Header
