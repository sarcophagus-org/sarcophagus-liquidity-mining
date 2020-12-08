import { useState, useEffect } from 'react'
import { useWeb3 } from '../../web3'

const Hidden = ({ children }) => {
  const { account } = useWeb3()
  const [emoji, setEmoji] = useState("")

  useEffect(() => {
    const emojis = ["🙈", "🙊", "🧐", "😑", "😵", "🤐", "🤭", "🤫", "🤨"]
    const random = Math.floor(Math.random() * emojis.length)
    setEmoji(emojis[random])
  }, [])

  return (
    <>
      {account ? children : emoji}
    </>
  )
}

export { Hidden }
