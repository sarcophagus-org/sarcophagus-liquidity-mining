import Blocks from './Blocks'
import GlobalStats from './GlobalStats'
import StakeForm from './StakeForm'
import Claim from './Claim'
import Unlock from './Unlock'

const Body = () => {
  return (
    <div>
      <Blocks />
      <GlobalStats />
      <div className="border-2 border-gray-500 mb-6 py-6 px-4">
        <StakeForm />
        <Claim />
        <Unlock />
      </div>
    </div>
  )
}

export default Body
