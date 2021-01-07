import { useData } from '../dataContext'

const Title = ({ children }) => {
  return (
    <div className="text-xl pt-3 mb-6 text-center sm:text-left">{children}</div>
  )
}

const Question = ({ children }) => {
  return (
    <div className=" mb-2">
      {children}
    </div>
  )
}

const Answer = ({ children }) => {
  return (
    <div className="text-xs mb-4 text-gray-400">
      {children}
    </div>
  )
}

const FAQ = () => {
  const { sarcoContract } = useData()

  return (
    <div>
      <Title>FAQ</Title>
      
      <Question>What is Sarcophagus?</Question>
      <Answer>It is a decentralized dead man's switch application built on Ethereum and Arweave, you can learn more about the project by visiting <a className="underline" href="https://sarcophagus.io">sarcophagus.io</a>, or <a className="underline" href="https://sarcophagus.io/assets/pdf/sarcophagus_litepaper_v0.2.pdf">reading the litepaper</a>.</Answer>
      
      <Question>What is SARCO?</Question>
      <Answer>SARCO is an ERC20 token with a fixed supply of 100,000,000. More information on the SARCO token can be found at <a className="underline" href="https://sarcophagus.io/sarco_token.html">sarcophagus.io/sarco_token.html</a> the token is used exclusively by the parties interacting with the dApp.</Answer>

      <Question>What is liquidity mining?</Question>
      <Answer>The process of locking stablecoins into a contract for a period of time, forgoing the opportunity of time-value yield for those stablecoins in exchange for a proportional emission of SARCO tokens. </Answer>

      <Question>How long will this last?</Question>
      <Answer>The Sarcophagus liquidity mining contract will last one year, and 1,000,000 SARCO tokens will be emitted.</Answer>

      <Question>How are the SARCO tokens emitted?</Question>
      <Answer>The contract specifies that 1,000,000 SARCO tokens will be emitted equally, per second, to the owners of the stablecoins in the contract. The distribution curve is linear, meaning the exact same number of tokens will be emitted per second on day 0 and day 364. You can see the value by looking at the "SARCO Per Second" metric.</Answer>

      <Question>What stablecoins are accepted?</Question>
      <Answer>The contract will accept USDC, USDT, and DAI. These stablecoins represent the vast majority of stablecoins in the market by volume and market cap. These coins are only accepted through the functions shown on this page, any other attempt to lock tokens using custom methods should be done at your own risk.</Answer>

      <Question>How do I lock my stablecoins?</Question>
      <Answer>First, connect your web3 wallet containing the tokens you wish to lock. Input the amount of each accepted stablecoins you wish to lock in their respective fields; making sure there are zeros in the fields you do not wish to lock. You will then be asked to "Approve" these stablecoins by your wallet. Once this approval is complete you will be able to click on the "Lock my Stablecoins" button. After the transaction is confirmed, you will see your address's current totals in the lower right section.</Answer>

      <Question>When can I unlock my stablecoins?</Question>
      <Answer>Any time you want. All tokens are 100% liquid and can be locked, unlocked and claimed at any time.</Answer>

      <Question>How do I unlock my stablecoins?</Question>
      <Answer>Simply click the "Unlock my Stablecoins" button and confirm the transaction on your wallet. This function will unlock all of the stablecoins you have locked, and will also automatically claim all SARCO that has been emitted to you.</Answer>

      <Question>How do I claim the SARCO that has been emitted but also keep my stablecoins locked?</Question>
      <Answer>Use the "Claim my SARCO" function. This will require a transaction from your wallet and the SARCO tokens will be unlocked. You will need to add a "custom token" in metamask to see it in your wallet (<a className="underline" href="https://metamask.zendesk.com/hc/en-us/articles/360015489031-How-to-View-See-Your-Tokens-and-Custom-Tokens-in-Metamask">instructions here</a>). The token address to use is: {sarcoContract?.address} and can be verified on <a className="underline" href={`https://etherscan.io/token/${sarcoContract?.address}`}>Etherscan</a>.</Answer>

      <Question>What gas settings should I use?</Question>
      <Answer>It is suggested that you use the "high" presets on MetaMask, or to visit <a className="underline" href="https://ethgasstation.info">ethgasstation.info</a> and use the "fast" price.</Answer>

      <Question>Why do some of the metrics displayed not add up or not make sense?</Question>
      <Answer>This frontend is pulling directly from the Ethereum blockchain, please give it a few seconds to fully update and you will be able to see the correct metrics.</Answer>
      
      <div className="border-b border-gray-500 mb-6 pt-6" />

      <Title>Definitions</Title>

      <Question>Locker</Question>
      <Answer>One who locks stablecoins into this liquidity mining contract.</Answer>

      <Question>Start Time</Question>
      <Answer>When the liquidity mining contract is open to accept stablecoins and emit SARCO.</Answer>

      <Question>End Time</Question>
      <Answer>When the last SARCO tokens will be emitted and when stablecoin locking will be disabled. Unlocking of stablecoins and claiming of SARCO is still available after this time.</Answer>

      <Question>Current time</Question>
      <Answer>Current time pulled from the Ethereum blockchain.</Answer>

      <Question>SARCO Per Second</Question>
      <Answer>The number of SARCO tokens emitted to the aggregate stablecoin lockers per second.</Answer>

      <Question>Emitted SARCO</Question>
      <Answer>The number of SARCO tokens that have been emitted to stablecoin lockers thus far.</Answer>

      <Question>Unemitted SARCO</Question>
      <Answer>The number of SARCO tokens in the contract that have yet to be emitted.</Answer>

      <Question>Total SARCO</Question>
      <Answer>The sum of emitted and unemitted SARCO tokens, set to 1,000,000, which equals 1% of the fixed 100,000,000 SARCO token supply.</Answer>

      <Question>Total Claimed SARCO</Question>
      <Answer>The number of SARCO tokens that have been emitted AND claimed by stablecoin lockers. These tokens are fully liquid.</Answer>

      <Question>Total Unclaimed SARCO</Question>
      <Answer>The number of SARCO tokens that have been emitted, but are still sitting in the liquidity mining contract waiting for the locker to claim them.</Answer>

      <Question>Total Locked USDC, USDT, DAI</Question>
      <Answer>The number of each type of accepted stablecoin that is currently locked in the liquidity mining contract.</Answer>

      <Question>Total Locked Stablecoins</Question>
      <Answer>The total number of stablecoins currently locked in the liquidity mining contract.</Answer>

      <Question>USDC/USDT/DAI Input Fields</Question>
      <Answer>These fields are used to lock your stablecoins. The amounts in unused fields must be "0" for any operation. The first step is to approve your stablecoins (only has to be done once per coin). The second step is to lock the stablecoins. The "balance" is the current unlocked balance in your wallet.</Answer>

      <Question>Approve my Stablecoins</Question>
      <Answer>Used to approve your ERC20 stablecoins for use on the liquidity mining contract.</Answer>

      <Question>Lock my Stablecoins</Question>
      <Answer>Used to lock your stablecoins into the liquidity mining contract.</Answer>

      <Question>SARCO/second</Question>
      <Answer>The number of SARCO you are currently being emitted per second.</Answer>

      <Question>SARCO Pending/Claimed/Total</Question>
      <Answer>The number of SARCO tokens that have been emitted to you and are claimable, the number of tokens that you have claimed into your wallet, and the total number of SARCO that have been emitted to your address respectively.</Answer>

      <Question>USDC/USDT/DAI/Total Locked</Question>
      <Answer>The number of stablecoins you currently have locked in the liquidity mining contract.</Answer>

      <Question>Unlock my Stablecoins</Question>
      <Answer>When executed, this will unlock all of your stable coins back into your wallet, and will automatically claim all of your pending SARCO tokens.</Answer>
    </div>
  )
}

export default FAQ
