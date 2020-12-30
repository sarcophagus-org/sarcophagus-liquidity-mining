import Blocks from './Blocks'
import GlobalStats from './GlobalStats'
import Transactions from './Transactions'

const Body = () => {
  return (
    <div>
      <Blocks />
      <GlobalStats />
      <div className="py-6 border-t border-gray-500 text-center">
        <Transactions />
      </div>
    </div>
  )
}

export default Body
