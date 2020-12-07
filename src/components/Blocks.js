import numeral from 'numeral'
import { useData } from '../dataContext'
import { Value } from './shared/Value'

const Blocks = () => {
  const {
    currentTime,
    startTime,
    firstStakeTime,
    endTime,
    timeUntilKickoff,
    remainingTime,
    totalRewards,
    rewardsPerTime,
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

  const StaticRewardInfo = ({ rate = true }) => {
    return (
      <ValueItemContainer>
        <ValueItem value={totalRewards}>Total Rewards</ValueItem>
        {rate && <ValueItem value={rewardsPerTime}>Rewards Per Second</ValueItem>}
      </ValueItemContainer>
    )
  }

  const NotScheduled = () => {
    return (
      <Container>
        <Description>Liquidity Mining hasn't started or been scheduled yet! Stay tuned...</Description>
        <ValueItemContainer>
          <ValueItem value={currentTime}>Current Time</ValueItem>
        </ValueItemContainer>
      </Container>
    )
  }

  const Scheduled = () => {
    return (
      <Container>
        <Description>Liquidity Mining starting block has been scheduled!</Description>
        <ValueItemContainer>
          <ValueItem value={currentTime}>Current Time</ValueItem>
          <ValueItem value={startTime}>Start Time</ValueItem>
          <ValueItem value={timeUntilKickoff}>Time Until Kickoff</ValueItem>
        </ValueItemContainer>
        <StaticRewardInfo rate={false} />
      </Container>
    )
  }

  const Ready = () => {
    return (
      <Container>
        <Description>Ready for the first stake!</Description>
        <ValueItemContainer>
          <ValueItem value={currentTime}>Current Time</ValueItem>
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
          <ValueItem value={firstStakeTime}>Start Time</ValueItem>
          <ValueItem value={currentTime}>Current Time</ValueItem>
          <ValueItem value={endTime}>End Time</ValueItem>
          <ValueItem value={remainingTime}>Remaining Time</ValueItem>
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
          <ValueItem value={firstStakeTime}>Start Time</ValueItem>
          <ValueItem value={endTime}>End Time</ValueItem>
          <ValueItem value={currentTime}>Current Time</ValueItem>
        </ValueItemContainer>
        <StaticRewardInfo />
      </Container>
    )
  }

  if (numeral(startTime).value() === 0) {
    return <NotScheduled />
  } else if (numeral(timeUntilKickoff).value() > 0) {
    return <Scheduled />
  } else if (numeral(firstStakeTime).value() === 0) {
    return <Ready />
  } else if (numeral(remainingTime).value() > 0) {
    return <Active />
  } else {
    return <Over />
  }
}

export default Blocks
