import { useData } from '../dataContext'
import numeral from 'numeral'

const Blocks = () => {
  const { currentBlock, startBlock, firstStakeBlock, blockLength } = useData()

  const Details = () => {
    if (startBlock.eq(0)) {
      return (
        <div className="mx-2 italic">
          Liquidity Mining hasn't started or been scheduled yet! Stay tuned...
        </div>
      )
    } else if (firstStakeBlock.eq(0)) {
      return (
        <>
          <div className="mx-2 italic">
            Liquidity mining starting block has been scheduled!
          </div>
          <div className="mx-2">
            Starting Block: {numeral(startBlock.toString()).format()}
          </div>
          <div className="mx-2">
            Blocks until kickoff: {numeral(startBlock.sub(currentBlock).toString()).format()}
          </div>
        </>
      )
    } else {
      return (
        <>
          <div className="mx-2">
            Starting Block: {numeral(firstStakeBlock.toString()).format()}
          </div>
          <div className="mx-2">
            Ending Block: {numeral(firstStakeBlock.add(blockLength).toString()).format()}
          </div>
          <div className="mx-2">
            Remaining Blocks: {numeral(firstStakeBlock.add(blockLength).sub(currentBlock).toString()).format()}
          </div>
        </>
      )
    }
  }

  return (
    <div className="flex justify-center mb-6 -mx-2 border-b pb-6">
      <div className="mx-2">
        Current Block: {currentBlock.toString()}
      </div>
      <Details />
    </div>
  )
}

export default Blocks
