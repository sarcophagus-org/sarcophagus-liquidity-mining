/* global artifacts web3 */

const LiquidityMiningLP = artifacts.require('LiquidityMiningLP')
const SarcoMock = artifacts.require('SarcoMock')
const BN = web3.utils.BN

module.exports = async function (_, network) {
  if (['develop', 'test'].includes(network)) {
    const liquidityMiningLP = await LiquidityMiningLP.deployed()
    const amount = (new BN(1000000)).mul(new BN(10).pow(new BN(18)))

    const sarcoMock = await SarcoMock.deployed()
    await sarcoMock.transfer(liquidityMiningLP.address, amount)

    const currentTime = (await web3.eth.getBlock('latest')).timestamp
    const startTime = currentTime + 60 * 1
    const endTime = currentTime + 60 * 120
    await liquidityMiningLP.deposit(amount, startTime, endTime)
  } else if (['mainnet', 'mainnet-fork'].includes(network)) {
    const liquidityMiningLP = await LiquidityMiningLP.deployed()
    const amount = (new BN(1000000)).mul(new BN(10).pow(new BN(18)))

    // tokens will be sent to the Liquidity Mining contract, outside of this migration

    const startTime = 1610582400 // Jan 14 2021 00:00:00 GMT
    const endTime = startTime + (60 * 60 * 24 * 365) // 1 year
    await liquidityMiningLP.deposit(amount, startTime, endTime)
  }
}
