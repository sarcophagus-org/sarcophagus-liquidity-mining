import { Value } from './shared/Value'
import { useData } from '../dataContext'

const Transactions = () => {
  const {
    myUsdcBalance,
    myUsdtBalance,
    myDaiBalance
  } = useData()

  const Container = ({ children }) => {
    return (
      <div className="-mb-4 flex justify-center -mx-4">
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
          <Value>{myUsdcBalance}</Value>
        </Section>
        <Section>
          <Title>My USDT Balance</Title>
          <Value>{myUsdtBalance}</Value>
        </Section>
        <Section>
          <Title>My DAI Balance</Title>
          <Value>{myDaiBalance}</Value>
        </Section>
      </SectionContainer>
    </Container>
  )
}

export default Transactions
