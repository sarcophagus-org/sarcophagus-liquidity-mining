import { Value } from './shared/Value'
import { Hidden } from './shared/Hidden'
import StakeForm from './StakeForm'
import { useData } from '../dataContext'

const Transactions = () => {
  const {
    myUsdcBalance,
    myUsdtBalance,
    myDaiBalance
  } = useData()

  const Container = ({ children }) => {
    return (
      <div className="-mb-4 flex flex-col items-center -mx-4">
        {children}
      </div>
    )
  }

  const SectionContainer = ({ children }) => {
    return (
      <div className="mb-4 flex">
        {children}
      </div>
    )
  }

  const Section = ({ children }) => {
    return (
      <div className="mx-4">
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
          <Title>My USDC Balance</Title>
          <Hidden><Value>{myUsdcBalance}</Value></Hidden>
        </Section>
        <Section>
          <Title>My USDT Balance</Title>
          <Hidden><Value>{myUsdtBalance}</Value></Hidden>
        </Section>
        <Section>
          <Title>My DAI Balance</Title>
          <Hidden><Value>{myDaiBalance}</Value></Hidden>
        </Section>
      </SectionContainer>
      <SectionContainer>
        <Section>
          <StakeForm />
        </Section>
      </SectionContainer>
    </Container>
  )
}

export default Transactions