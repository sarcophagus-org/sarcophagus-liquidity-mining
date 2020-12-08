/* global artifacts web3 */

const LiquidityMining = artifacts.require('LiquidityMining')
const SarcoMock = artifacts.require('SarcoMock')
const BN = web3.utils.BN

module.exports = async function (_, network) {
  if (['develop', 'test'].includes(network)) {
    const liquidityMining = await LiquidityMining.deployed()
    const amount = (new BN(1000000)).mul(new BN(10).pow(new BN(18)))

    const sarcoMock = await SarcoMock.deployed()
    await sarcoMock.approve(liquidityMining.address, amount)

    const currentTime = (await web3.eth.getBlock('latest')).timestamp
    const startTime = currentTime + 30
    const endTime = currentTime + 60 * 8
    await liquidityMining.deposit(amount, startTime, endTime)
  } else if (['goerli', 'goerli-fork'].includes(network)) {
    const liquidityMining = await LiquidityMining.deployed()
    const amount = (new BN(1000000)).mul(new BN(10).pow(new BN(18)))

    const sarcoMock = await SarcoMock.deployed()
    await sarcoMock.approve(liquidityMining.address, amount)

    const startTime = 1607698800
    const endTime = 1610118000
    await liquidityMining.deposit(amount, startTime, endTime)
  }
}
