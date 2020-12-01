import { 
  useTotalUsdcDeposits,
  useTotalUsdtDeposits,
  useTotalDaiDeposits
} from "../web3/liquidityMining"

const GlobalStats = () => {
  const usdc = useTotalUsdcDeposits()
  const usdt = useTotalUsdtDeposits()
  const dai = useTotalDaiDeposits()

  const Section = ({ children }) => {
    return (
      <div className="mb-4">
        {children}
      </div>
    )
  }

  const Title = ({ children }) => {
    return (
      <div className="text-xl">
        {children}
      </div>
    )
  }

  const Value = ({ children }) => {
    return (
      <div className="font-mono">
        {children}
      </div>
    )
  }

  return (
    <div className="-mb-4">
      <Section>
        <Title>Total Staked USDC</Title>
        <Value>{usdc}</Value>
      </Section>
      <Section>
        <Title>Total Staked USDT</Title>
        <Value>{usdt}</Value>
      </Section>
      <Section>
        <Title>Total Staked DAI</Title>
        <Value>{dai}</Value>
      </Section>
    </div>
  )
}

export default GlobalStats
