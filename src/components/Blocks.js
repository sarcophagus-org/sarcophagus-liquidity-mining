import numeral from 'numeral'
import { useData } from '../dataContext'
import { Value } from './shared/Value'

const Blocks = () => {
  const { currentBlock, startBlock, firstStakeBlock, endingBlock, blocksUntilKickoff, remainingBlocks } = useData()

  const Container = ({ children }) => {
    return (
      <div className="flex flex-col items-center text-center mb-6 border-b border-t py-6">
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
      <div className="flex justify-center -mx-2">
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

  if (numeral(startBlock).value() === 0) {
    return (
      <Container>
        <Description>Liquidity Mining hasn't started or been scheduled yet! Stay tuned...</Description>
        <ValueItemContainer>
          <ValueItem value={currentBlock}>Current Block</ValueItem>
        </ValueItemContainer>
      </Container>
    )
  } else if (numeral(blocksUntilKickoff).value() > 0) {
    return (
      <Container>
        <Description>Liquidity Mining starting block has been scheduled!</Description>
        <ValueItemContainer>
          <ValueItem value={currentBlock}>Current Block</ValueItem>
          <ValueItem value={startBlock}>Starting Block</ValueItem>
          <ValueItem value={blocksUntilKickoff}>Blocks until kickoff</ValueItem>
        </ValueItemContainer>
      </Container>
    )
  } else if (numeral(remainingBlocks).value() < 0) {
    return (
      <Container>
        <Description>Ready for the first stake!</Description>
        <ValueItemContainer>
          <ValueItem value={startBlock}>Starting Block</ValueItem>
          <ValueItem value={currentBlock}>Current Block</ValueItem>
        </ValueItemContainer>
      </Container>
    )
  } else if (numeral(remainingBlocks).value () >= 0) {
    return (
      <Container>
        <Description>Liquidity Mining is active!</Description>
        <ValueItemContainer>
          <ValueItem value={firstStakeBlock}>Starting Block</ValueItem>
          <ValueItem value={currentBlock}>Current Block</ValueItem>
          <ValueItem value={endingBlock}>Ending Block</ValueItem>
          <ValueItem value={remainingBlocks}>Remaining Blocks</ValueItem>
        </ValueItemContainer>
      </Container>
    )
  } else {
    return (
      <Container>
        <Description>Liquidity Mining is over!</Description>
        <ValueItemContainer>
          <ValueItem value={firstStakeBlock}>Starting Block</ValueItem>
          <ValueItem value={endingBlock}>Ending Block</ValueItem>
          <ValueItem value={currentBlock}>Current Block</ValueItem>
        </ValueItemContainer>
      </Container>
    )
  }
}

export default Blocks
