import { useInjectedConnect, manuallyConnect } from '../web3/injected'

const Header = () => {
  const web3 = useInjectedConnect()
  
  const AccountDisplay = ({ account }) => {
    if (account) {
      return (
        <div>
          {account}
        </div>
      )
    } else {
      return (
        <button onClick={() => manuallyConnect(web3)}>
          Connect Web3 Account
        </button>
      )
    }
  }

  return (
    <div className="text-center">
      <h1 className="my-8 text-5xl">
        Sarcophagus Liquidity Mining
      </h1>
      <div>
        <AccountDisplay account={web3.account} />
      </div>
    </div>
  )
}

export default Header
