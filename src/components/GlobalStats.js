import {
  useTotalUsdcDeposits,
  useTotalUsdtDeposits,
  useTotalDaiDeposits,
  useTotalSarcoRewards,
  useTotalClaimedSarcoRewards,
  usePerBlockSarcoRewards
} from "../web3/liquidityMining"

const GlobalStats = () => {
  const usdc = useTotalUsdcDeposits()
  const usdt = useTotalUsdtDeposits()
  const dai = useTotalDaiDeposits()
  const sarco = useTotalSarcoRewards()
  const claimed = useTotalClaimedSarcoRewards()
  const perBlock = usePerBlockSarcoRewards()

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
      <div className="font-mono bg-gray-300 dark:bg-gray-600 px-2 inline">
        {children}
      </div>
    )
  }

  return (
    <div className="-mb-4 flex justify-end -mx-4">
      <div className="mx-4">
        <Section>
          <Title>Total SARCO Rewards</Title>
          <Value>{sarco}</Value>
        </Section>
        <Section>
          <Title>Total Claimed Rewards</Title>
          <Value>{claimed}</Value>
        </Section>
        <Section>
          <Title>Rewards Per Block</Title>
          <Value>{perBlock}</Value>
        </Section>
      </div>
      <div className="mx-4">
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
    </div>
  )
}

export default GlobalStats
