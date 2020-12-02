import Blocks from './Blocks'
import GlobalStats from './GlobalStats'
import Stakes from './Stakes'

const Body = () => {
  return (
    <div>
      <Blocks />
      <div className="flex flex-col sm:flex-row pb-4">
        <div className="flex-auto text-center sm:text-right">
          <GlobalStats />
        </div>
        <div className="mx-2 w-1 border-r border-grey-300" />
        <div className="flex-auto text-center sm:text-left">
          <Stakes />
        </div>
      </div>
    </div>
  )
}

export default Body
