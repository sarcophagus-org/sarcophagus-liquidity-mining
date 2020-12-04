import { useInjectedConnect, manuallyConnect } from '../web3/injected'

const Header = () => {
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

  const AccountDisplay = ({ account }) => {
    if (account) {
      return (
        <div>
          {truncate(account, 25)}
        </div>
      )
    } else {
      return (
        <button onClick={() => manuallyConnect(injected)}>
          Connect Web3 Account
        </button>
      )
    }
  }

  return (
    <div className="text-center py-6">
      <h1 className="mb-3 text-5xl">
        Sarcophagus Liquidity Mining
      </h1>
      <div className="text-lg">
        <AccountDisplay account={injected.account} />
      </div>
    </div>
  )
}

export default Header
