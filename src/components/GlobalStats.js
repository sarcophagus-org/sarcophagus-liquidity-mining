import { useData } from '../dataContext'
import { Value } from './shared/Value'

const GlobalStats = () => {
  const {
    totalEmittedRewards,
    totalUnemittedRewards,
    totalClaimedRewards,
    totalUnclaimedRewards,
    totalStakeUsdc,
    totalStakeUsdt,
    totalStakeDai,
    totalStakeStablecoins,
  } = useData()

  const Container = ({ children }) => {
    return (
      <div className="-mb-4 flex justify-center md:justify-end -mx-4">
        {children}
      </div>
    )
  }

  const SectionContainer = ({ children }) => {
    return (
      <div className="mx-4">
        {children}
      </div>
    )
  }

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
    <Container>
      <SectionContainer>
        <Section>
          <Title>Emitted Rewards</Title>
          <Value>{totalEmittedRewards}</Value>
        </Section>
        <Section>
          <Title>Unemitted Rewards</Title>
          <Value>{totalUnemittedRewards}</Value>
        </Section>
        <Section>
          <Title>Total Claimed Rewards</Title>
          <Value>{totalClaimedRewards}</Value>
        </Section>
        <Section>
          <Title>Total Unclaimed Rewards</Title>
          <Value>{totalUnclaimedRewards}</Value>
        </Section>
      </SectionContainer>
      <SectionContainer>
        <Section>
          <Title>Total Staked USDC</Title>
          <Value>{totalStakeUsdc}</Value>
        </Section>
        <Section>
          <Title>Total Staked USDT</Title>
          <Value>{totalStakeUsdt}</Value>
        </Section>
        <Section>
          <Title>Total Staked DAI</Title>
          <Value>{totalStakeDai}</Value>
        </Section>
        <Section>
          <Title>Total Staked Stablecoins</Title>
          <Value>{totalStakeStablecoins}</Value>
        </Section>
      </SectionContainer>
    </Container>
  )
}

export default GlobalStats
