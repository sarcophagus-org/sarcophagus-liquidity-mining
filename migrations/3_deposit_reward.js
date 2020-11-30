/* global artifacts web3 */

const LiquidityMining = artifacts.require("LiquidityMining")
const SarcoMock = artifacts.require("SarcoMock")
const BN = web3.utils.BN

module.exports = async function (_, network) {
  if (!["mainnet", "mainnet-fork"].includes(network)) {
    const liquidityMining = await LiquidityMining.deployed()    
    const amount = (new BN(500000)).mul(new BN(10).pow(new BN(18)))

    const sarcoMock = await SarcoMock.deployed()
    await sarcoMock.approve(liquidityMining.address, amount)

    const blockLength = 1000
    await liquidityMining.deposit(amount, (await web3.eth.getBlock("latest")).number + 1, blockLength)
  }
}
