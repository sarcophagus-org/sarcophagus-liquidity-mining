import Blocks from './Blocks'
import GlobalStats from './GlobalStats'
import MyStats from './MyStats'

const Body = () => {
  return (
    <div>
      <Blocks />
      <div className="flex flex-col md:flex-row pb-4">
        <div className="flex-auto text-center md:text-right">
          <GlobalStats />
        </div>
        <div className="my-4 md:my-0 md:mx-4 border-b border-r border-grey-300" />
        <div className="flex-auto text-center md:text-left">
          <MyStats />
        </div>
      </div>
    </div>
  )
}

export default Body
