import { useState, useEffect } from 'react'
import numeral from 'numeral'
import { Value } from './shared/Value'
import { Hidden } from './shared/Hidden'
import StakeForm from './StakeForm'
import { useData } from '../dataContext'

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

const MyBalances = () => {
  const {
    myUsdcBalance,
    myUsdtBalance,
    myDaiBalance,
  } = useData()

  const Title = ({ children }) => {
    return (
      <div className="text-xl">
        {children}
      </div>
    )
  }

  return (
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
  )
}

const StakeSection = () => {
  const {
    blocksUntilKickoff,
    startBlock,
    firstStakeBlock,
    remainingBlocks,
    endingBlock
  } = useData()

  const [canStake, setCanStake] = useState(false)
  useEffect(() => {
    setCanStake(
      (
        numeral(startBlock).value() > 0 &&
        numeral(blocksUntilKickoff).value() === 0 &&
        numeral(endingBlock).value() === 0
      ) || (
        numeral(firstStakeBlock).value() > 0 &&
        numeral(remainingBlocks).value() > 0
      ))
  }, [blocksUntilKickoff, startBlock, firstStakeBlock, remainingBlocks, endingBlock])

  if (canStake) {
    return <StakeForm />
  }

  return <></>
}

const Transactions = () => {
  const Container = ({ children }) => {
    return (
      <div className="-mb-4 flex flex-col items-center -mx-4">
        {children}
      </div>
    )
  }

  return (
    <Container>
      <MyBalances />
      <SectionContainer>
        <Section>
          <StakeSection />
        </Section>
      </SectionContainer>
    </Container>
  )
}

export default Transactions
