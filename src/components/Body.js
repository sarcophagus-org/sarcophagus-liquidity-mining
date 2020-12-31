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
      <div className="border-2 border-gray-500 mb-6 py-6 px-4 flex justify-center">
        <div className="max-w-2xl flex flex-col sm:flex-row sm:items-end">
          <div className="sm:w-1/2 mb-12 sm:mb-8 sm:mr-2">
            <StakeForm />
          </div>
          <div className="sm:w-1/2 text-sm mb-8">
            <div className="mx-6">
              <div className="mb-12">
                <Claim />
              </div>
              <Unlock />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Body
