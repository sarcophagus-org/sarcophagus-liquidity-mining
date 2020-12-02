import { useData } from '../dataContext'
import { Value } from './shared/Value'

const GlobalStats = () => {
  const data = useData()

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

  return (
    <div className="-mb-4 flex justify-center sm:justify-end -mx-4">
      <div className="mx-4">
        <Section>
          <Title>Total SARCO Rewards</Title>
          <Value>{data.totalRewards}</Value>
        </Section>
        <Section>
          <Title>Rewards Per Block</Title>
          <Value>{data.rewardsPerBlock}</Value>
        </Section>
        <Section>
          <Title>Total Claimed Rewards</Title>
          <Value>{data.totalClaimedRewards}</Value>
        </Section>
      </div>
      <div className="mx-4">
        <Section>
          <Title>Total Staked USDC</Title>
          <Value>{data.totalStakeUsdc}</Value>
        </Section>
        <Section>
          <Title>Total Staked USDT</Title>
          <Value>{data.totalStakeUsdt}</Value>
        </Section>
        <Section>
          <Title>Total Staked DAI</Title>
          <Value>{data.totalStakeDai}</Value>
        </Section>
      </div>
    </div>
  )
}

export default GlobalStats
