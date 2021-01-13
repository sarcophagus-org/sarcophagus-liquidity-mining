import { useData } from '../dataContext'
import { ValueItem } from './shared/Value'

const Container = ({ children }) => {
  return (
    <div className="flex flex-wrap justify-center text-center border-b border-t pt-6 mb-6 border-gray-500">
      {children}
    </div>
  )
}

const currentTimeTooltip = "\"Current Time\" comes from the timestamp of the most recent Ethereum block. That's why it slightly jumps around, and probably doesn't directly match your system clock."

const NotScheduled = () => {
  const { currentTime } = useData()

  return (
    <Container>
      <ValueItem value={currentTime} tooltipText={currentTimeTooltip}>Current Time</ValueItem>
    </Container>
  )
}

const Scheduled = () => {
  const { currentTime, startTime, timeUntilKickoff } = useData()

  return (
    <Container>
      <ValueItem value={currentTime} tooltipText={currentTimeTooltip}>Current Time</ValueItem>
      <ValueItem value={startTime}>Start Time</ValueItem>
      <ValueItem value={timeUntilKickoff}>Time Until Kickoff</ValueItem>
    </Container>
  )
}

const Ready = () => {
  const { currentTime, rewardsPerTime } = useData()

  return (
    <Container>
      <ValueItem value={currentTime} tooltipText={currentTimeTooltip}>Current Time</ValueItem>
      <ValueItem value={rewardsPerTime}>SARCO Per Second</ValueItem>
    </Container>
  )
}

const Active = () => {
  const { currentTime, firstStakeTime, endTime, remainingTime, rewardsPerTime } = useData()

  return (
    <Container>
      <ValueItem value={firstStakeTime}>Start Time</ValueItem>
      <ValueItem value={currentTime} tooltipText={currentTimeTooltip}>Current Time</ValueItem>
      <ValueItem value={endTime}>End Time</ValueItem>
      <ValueItem value={remainingTime}>Remaining Time</ValueItem>
      <ValueItem value={rewardsPerTime}>SARCO Per Second</ValueItem>
    </Container>
  )
}

const Over = () => {
  const { currentTime, firstStakeTime, endTime, rewardsPerTime } = useData()

  return (
    <Container>
      <ValueItem value={firstStakeTime}>Start Time</ValueItem>
      <ValueItem value={endTime}>End Time</ValueItem>
      <ValueItem value={currentTime} tooltipText={currentTimeTooltip}>Current Time</ValueItem>
      <ValueItem value={rewardsPerTime}>SARCO Per Second</ValueItem>
    </Container>
  )
}

const Blocks = () => {
  const { systemState, StateEnum } = useData()

  if (systemState === StateEnum.NotScheduled) {
    return <NotScheduled />
  } else if (systemState === StateEnum.Scheduled) {
    return <Scheduled />
  } else if (systemState === StateEnum.Ready) {
    return <Ready />
  } else if (systemState === StateEnum.Active) {
    return <Active />
  } else if (systemState === StateEnum.Over) {
    return <Over />
  } else {
    return <></>
  }
}

export default Blocks
