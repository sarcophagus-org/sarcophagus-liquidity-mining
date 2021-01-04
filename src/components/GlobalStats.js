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
    totalClaimedRewards,
    totalUnclaimedRewards,
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
        <ValueItem bigValue bold value={totalRewards}
          tooltipText="&quot;Total SARCO&quot; is the sum of Emitted SARCO and Unemitted SARCO, which shows the total number of SARCO that liquidity mining will produce"
        >Total SARCO</ValueItem>
      </SectionContainer>
      <SectionContainer topBorder>
        <ValueItem bigValue value={totalClaimedRewards}
          tooltipText="&quot;Total Claimed SARCO&quot; is the sum of all SARCO which have been claimed (via transactions to own wallets) from liquidity mining, by all participants"
        >Total Claimed SARCO</ValueItem>
        <ValueItem bigValue value={totalUnclaimedRewards}
          tooltipText="&quot;Total Unclaimed SARCO&quot; is calculated as as &quot;Emitted SARCO&quot; minus &quot;Total Claimed SARCO&quot;"
        >Total Unclaimed SARCO</ValueItem>
      </SectionContainer>
      <SectionContainer topBorder>
        <ValueItem bigValue icon={usdc} value={totalStakeUsdc}>Total Locked USDC</ValueItem>
        <ValueItem bigValue icon={usdt} value={totalStakeUsdt}>Total Locked USDT</ValueItem>
        <ValueItem bigValue icon={dai} value={totalStakeDai}>Total Locked DAI</ValueItem>
        <ValueItem bigValue bold value={totalStakeStablecoins}
          tooltipText="&quot;Total Locked Stablecoins&quot; refers to the sum of all stablecoins that have been locked by everyone participating in liquidity mining"
        >Total Locked Stablecoins</ValueItem>
      </SectionContainer>
    </Container>
  )
}

export default GlobalStats
