import { useData } from '../dataContext'
import { ValueItem } from './shared/Value'
import usdc from '../assets/images/usdc-small.svg'
import usdt from '../assets/images/usdt-small.svg'
import dai from '../assets/images/dai-small.svg'

const Container = ({ children }) => {
  return (
    <div className="flex flex-col text-center">
      {children}
    </div>
  )
}

const SectionContainer = ({ children, topBorder = false }) => {
  return (
    <div className={`flex flex-col sm:flex-row flex-wrap justify-center ${topBorder ? "pt-6 sm:pt-0 border-t border-gray-500 sm:border-none" : "border-none"}`}>
      {children}
    </div>
  )
}

const GlobalStats = () => {
  const {
    totalEmittedRewards,
    totalUnemittedRewards,
    // totalClaimedRewards,
    // totalUnclaimedRewards,
    totalRewards,
    totalStakeUsdc,
    totalStakeUsdt,
    totalStakeDai,
    totalStakeStablecoins,
  } = useData()

  return (
    <Container>
      <SectionContainer>
        <ValueItem bigValue value={totalEmittedRewards}>Emitted SARCO</ValueItem>
        <ValueItem bigValue value={totalUnemittedRewards}>Unemitted SARCO</ValueItem>
        <ValueItem bigValue bold value={totalRewards}>Total SARCO</ValueItem>
      </SectionContainer>
      {/* <SectionContainer topBorder>
        <ValueItem bigValue value={totalClaimedRewards}>Total Claimed SARCO</ValueItem>
        <ValueItem bigValue value={totalUnclaimedRewards}>Total Unclaimed SARCO</ValueItem>
      </SectionContainer> */}
      <SectionContainer topBorder>
        <ValueItem bigValue icon={usdc} value={totalStakeUsdc}>Total Locked USDC</ValueItem>
        <ValueItem bigValue icon={usdt} value={totalStakeUsdt}>Total Locked USDT</ValueItem>
        <ValueItem bigValue icon={dai} value={totalStakeDai}>Total Locked DAI</ValueItem>
        <ValueItem bigValue bold value={totalStakeStablecoins}>Total Locked Stablecoins</ValueItem>
      </SectionContainer>
    </Container>
  )
}

export default GlobalStats
