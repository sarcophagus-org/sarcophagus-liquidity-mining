/* global artifacts web3 */

const LiquidityMining = artifacts.require('LiquidityMining')
const SarcoMock = artifacts.require('SarcoMock')
const BN = web3.utils.BN

module.exports = async function (_, network) {
  if (['develop', 'test'].includes(network)) {
    const liquidityMining = await LiquidityMining.deployed()
    const amount = (new BN(1000000)).mul(new BN(10).pow(new BN(18)))

    const sarcoMock = await SarcoMock.deployed()
    await sarcoMock.transfer(liquidityMining.address, amount)

    const currentTime = (await web3.eth.getBlock('latest')).timestamp
    const startTime = currentTime + 60 * 1
    const endTime = currentTime + 60 * 120
    await liquidityMining.deposit(amount, startTime, endTime)
  } else if (['goerli', 'goerli-fork'].includes(network)) {
    const liquidityMining = await LiquidityMining.deployed()
    const amount = (new BN(1000000)).mul(new BN(10).pow(new BN(18)))

    const sarcoMock = await SarcoMock.deployed()
    await sarcoMock.transfer(liquidityMining.address, amount)

    const startTime = 1609786800
    const endTime = 1609873200
    await liquidityMining.deposit(amount, startTime, endTime)
  } else if (['mainnet', 'mainnet-fork'].includes(network)) {
    const liquidityMining = await LiquidityMining.deployed()
    const amount = (new BN(1000000)).mul(new BN(10).pow(new BN(18)))

    // tokens will be sent to the Liquidity Mining contract, outside of this migration

    const startTime = 1610496000 // Jan 13 2021 00:00:00 GMT
    const endTime = startTime + (60 * 60 * 24 * 365) // 1 year
    await liquidityMining.deposit(amount, startTime, endTime)
  }
}
