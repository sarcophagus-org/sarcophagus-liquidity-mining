import { useData } from '../dataContext'
import { Value } from './shared/Value'
import { Hidden } from './shared/Hidden'

const Container = ({ children }) => {
  return (
    <div className="-mb-4 flex justify-center md:justify-start -mx-4">
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

const MyStats = () => {
  const {
    myStakeUsdc,
    myStakeUsdt,
    myStakeDai,
    myStakedStablecoins,
    myRewardsPerTime,
    myPendingRewards,
    myClaimedRewards,
    myTotalRewards,
  } = useData()

  return (
    <Container>
      <SectionContainer>
        <Section>
          <Title>My Staked USDC</Title>
          <Hidden><Value>{myStakeUsdc}</Value></Hidden>
        </Section>
        <Section>
          <Title>My Staked USDT</Title>
          <Hidden><Value>{myStakeUsdt}</Value></Hidden>
        </Section>
        <Section>
          <Title>My Staked DAI</Title>
          <Hidden><Value>{myStakeDai}</Value></Hidden>
        </Section>
        <Section>
          <Title>My Staked Stablecoins</Title>
          <Hidden><Value>{myStakedStablecoins}</Value></Hidden>
        </Section>
      </SectionContainer>
      <SectionContainer>
        <Section>
          <Title>My Rewards Per Second</Title>
          <Hidden><Value>{myRewardsPerTime}</Value></Hidden>
        </Section>
        <Section>
          <Title>My Pending Rewards</Title>
          <Hidden><Value>{myPendingRewards}</Value></Hidden>
        </Section>
        <Section>
          <Title>My Claimed Rewards</Title>
          <Hidden><Value>{myClaimedRewards}</Value></Hidden>
        </Section>
        <Section>
          <Title>My Total Rewards</Title>
          <Hidden><Value>{myTotalRewards}</Value></Hidden>
        </Section>
      </SectionContainer>
    </Container>
  )
}

export default MyStats
