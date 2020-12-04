import { useWeb3 } from '../../web3'

const Hidden = ({ children }) => {
  const { account } = useWeb3()

  const emojis = ["🙈", "🙊", "🧐", "😑", "😵", "🤐", "🤭", "🤫", "🤨"]
  const random = Math.floor(Math.random() * emojis.length)

  return (
    <>
      {account ? children : emojis[random]}
    </>
  )
}

export { Hidden }
