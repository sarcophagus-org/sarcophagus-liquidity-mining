import Blocks from './Blocks'
import GlobalStats from './GlobalStats'
import MyStats from './MyStats'
import Transactions from './Transactions'

const Body = () => {
  return (
    <div>
      <Blocks />
      <div className="flex flex-col">
        <div className="flex flex-col md:flex-row">
          <div className="flex-auto text-center md:text-right">
            <GlobalStats />
          </div>
          <div className="my-6 md:my-0 md:mx-4 border-b border-r border-grey-300" />
          <div className="flex-auto text-center md:text-left">
            <MyStats />
          </div>
        </div>
        <div className="mt-6 py-6 border-t border-grey-300 text-center">
          <Transactions />
        </div>
      </div>
    </div>
  )
}

export default Body
