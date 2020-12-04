import numeral from 'numeral'
import { useData } from '../dataContext'
import { Value } from './shared/Value'

const Blocks = () => {
  const {
    currentBlock,
    startBlock,
    firstStakeBlock,
    endingBlock,
    blocksUntilKickoff,
    remainingBlocks,
    totalRewards,
    rewardsPerBlock,
  } = useData()

  const Container = ({ children }) => {
    return (
      <div className="flex flex-col items-center text-center border-b border-t pt-6 pb-4 mb-6">
        {children}
      </div>
    )
  }

  const Description = ({ children }) => {
    return (
      <div className="mb-2 italic">
        {children}
      </div>
    )
  }

  const ValueItemContainer = ({ children }) => {
    return (
      <div className="flex justify-center -mx-2 mb-2">
        {children}
      </div>
    )
  }

  const ValueItem = ({ children, value }) => {
    return (
      <div className="mx-2">
        {children}: <Value>{value}</Value>
      </div>
    )
  }

  const StaticRewardInfo = () => {
    return (
      <ValueItemContainer>
        <ValueItem value={totalRewards}>Total Rewards</ValueItem>
        <ValueItem value={rewardsPerBlock}>Rewards Per Block</ValueItem>
      </ValueItemContainer>
    )
  }

  const NotScheduled = () => {
    return (
      <Container>
        <Description>Liquidity Mining hasn't started or been scheduled yet! Stay tuned...</Description>
        <ValueItemContainer>
          <ValueItem value={currentBlock}>Current Block</ValueItem>
        </ValueItemContainer>
      </Container>
    )
  }

  const Scheduled = () => {
    return (
      <Container>
        <Description>Liquidity Mining starting block has been scheduled!</Description>
        <ValueItemContainer>
          <ValueItem value={currentBlock}>Current Block</ValueItem>
          <ValueItem value={startBlock}>Starting Block</ValueItem>
          <ValueItem value={blocksUntilKickoff}>Blocks until kickoff</ValueItem>
        </ValueItemContainer>
        <StaticRewardInfo />
      </Container>
    )
  }

  const Ready = () => {
    return (
      <Container>
        <Description>Ready for the first stake!</Description>
        <ValueItemContainer>
          <ValueItem value={currentBlock}>Current Block</ValueItem>
        </ValueItemContainer>
        <StaticRewardInfo />
      </Container>
    )
  }

  const Active = () => {
    return (
      <Container>
        <Description>Liquidity Mining is active!</Description>
        <ValueItemContainer>
          <ValueItem value={firstStakeBlock}>Starting Block</ValueItem>
          <ValueItem value={currentBlock}>Current Block</ValueItem>
          <ValueItem value={endingBlock}>Ending Block</ValueItem>
          <ValueItem value={remainingBlocks}>Remaining Blocks</ValueItem>
        </ValueItemContainer>
        <StaticRewardInfo />
      </Container>
    )
  }

  const Over = () => {
    return (
      <Container>
        <Description>Liquidity Mining is over!</Description>
        <ValueItemContainer>
          <ValueItem value={firstStakeBlock}>Starting Block</ValueItem>
          <ValueItem value={endingBlock}>Ending Block</ValueItem>
          <ValueItem value={currentBlock}>Current Block</ValueItem>
        </ValueItemContainer>
        <StaticRewardInfo />
      </Container>
    )
  }

  if (numeral(startBlock).value() === 0) {
    return <NotScheduled />
  } else if (numeral(blocksUntilKickoff).value() > 0) {
    return <Scheduled />
  } else if (numeral(firstStakeBlock).value() === 0) {
    return <Ready />
  } else if (numeral(remainingBlocks).value() > 0) {
    return <Active />
  } else {
    return <Over />
  }
}

export default Blocks
