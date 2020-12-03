import { useData } from '../dataContext'
import { Value } from './shared/Value'
import { useWeb3 } from '../web3'

const MyStats = () => {
  const data = useData()
  const { account } = useWeb3()

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
    <div className="-mb-4 flex justify-center sm:justify-start -mx-4">
      <div className="mx-4">
        <Section>
          <Title>My Staked USDC</Title>
          <Value>{data.myStakeUsdc}</Value>
        </Section>
        <Section>
          <Title>My Staked USDT</Title>
          <Value>{data.myStakeUsdt}</Value>
        </Section>
        <Section>
          <Title>My Staked DAI</Title>
          <Value>{data.myStakeDai}</Value>
        </Section>
        <Section>
          <Title>My Staked Stablecoins</Title>
          <Value>{data.myStakedStablecoins}</Value>
        </Section>
      </div>
      <div className="mx-4">
        <Section>
          <Title>My Pending Rewards</Title>
          <Value>{data.myPendingRewards}</Value>
        </Section>
        <Section>
          <Title>My Claimed Rewards</Title>
          <Value>{data.myClaimedRewards}</Value>
        </Section>
        <Section>
          <Title>My Total Rewards</Title>
          <Value>{data.myTotalRewards}</Value>
        </Section>
      </div>
    </div>
  )
}

export default MyStats
