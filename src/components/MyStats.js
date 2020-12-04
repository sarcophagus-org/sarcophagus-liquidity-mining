import { useData } from '../dataContext'
import { Value } from './shared/Value'
import { useWeb3 } from '../web3'

const MyStats = () => {
  const { account } = useWeb3()
  const {
    myStakeUsdc,
    myStakeUsdt,
    myStakeDai,
    myStakedStablecoins,
    myPendingRewards,
    myClaimedRewards,
    myTotalRewards,
  } = useData()

  const Container = ({ children }) => {
    return (
      <div className="-mb-4 flex justify-center sm:justify-start -mx-4">
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

  if (!account) {
    return (
      <div>
        Connect your Web3 account to play!
      </div>
    )
  }

  return (
    <Container>
      <SectionContainer>
        <Section>
          <Title>My Staked USDC</Title>
          <Value>{myStakeUsdc}</Value>
        </Section>
        <Section>
          <Title>My Staked USDT</Title>
          <Value>{myStakeUsdt}</Value>
        </Section>
        <Section>
          <Title>My Staked DAI</Title>
          <Value>{myStakeDai}</Value>
        </Section>
        <Section>
          <Title>My Staked Stablecoins</Title>
          <Value>{myStakedStablecoins}</Value>
        </Section>
      </SectionContainer>
      <SectionContainer>
        <Section>
          <Title>My Pending Rewards</Title>
          <Value>{myPendingRewards}</Value>
        </Section>
        <Section>
          <Title>My Claimed Rewards</Title>
          <Value>{myClaimedRewards}</Value>
        </Section>
        <Section>
          <Title>My Total Rewards</Title>
          <Value>{myTotalRewards}</Value>
        </Section>
      </SectionContainer>
    </Container>
  )
}

export default MyStats
