import { useWeb3 } from '../web3'
import packageJson from '../../package.json'

const Footer = () => {
  const { name } = useWeb3()

  return (
    <div className="text-gray-400 text-xs">
      <div className="border-t flex justify-between py-2">
        <div>v{packageJson.version + '+' + process.env.REACT_APP_GIT_HASH}</div>
        <div>Sarcophagus © {(new Date()).getFullYear()}</div>
        <div>{name}</div>
      </div>
    </div>
  )
}

export default Footer
