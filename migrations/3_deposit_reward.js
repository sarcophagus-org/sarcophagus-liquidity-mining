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

    const blockLength = 25
    await liquidityMining.deposit(amount, (await web3.eth.getBlock('latest')).number + 8, blockLength)
  } else if (['goerli'].includes(network)) {
    const liquidityMining = await LiquidityMining.deployed()    
    const amount = (new BN(1000000)).mul(new BN(10).pow(new BN(18)))

    const sarcoMock = await SarcoMock.deployed()
    await sarcoMock.approve(liquidityMining.address, amount)

    const blockLength = 50000
    await liquidityMining.deposit(amount, (await web3.eth.getBlock('latest')).number + 100, blockLength)
  }
}
