/* global artifacts web3 */

const LiquidityMining = artifacts.require('LiquidityMining')
const UsdcMock = artifacts.require('UsdcMock')
const UsdtMock = artifacts.require('UsdtMock')
const DaiMock = artifacts.require('DaiMock')
const BN = web3.utils.BN

module.exports = async function (_, network, accounts) {
  if (['develop', 'test'].includes(network)) {
    const liquidityMining = await LiquidityMining.deployed()

    const usdcAmount = (new BN(100)).mul(new BN(10).pow(new BN(6)))
    const usdtAmount = (new BN(200)).mul(new BN(10).pow(new BN(6)))
    const daiAmount = (new BN(300)).mul(new BN(10).pow(new BN(18)))

    const usdc = await UsdcMock.deployed()
    await usdc.approve(liquidityMining.address, usdcAmount)

    const usdt = await UsdtMock.deployed()
    await usdt.transfer(accounts[1], usdtAmount)
    await usdt.approve(liquidityMining.address, usdtAmount, { from: accounts[1] })

    const dai = await DaiMock.deployed()
    await dai.transfer(accounts[1], daiAmount)
    await dai.approve(liquidityMining.address, daiAmount, { from: accounts[1] })

    await liquidityMining.stake(usdcAmount, 0, 0)
    await liquidityMining.stake(0, usdtAmount, daiAmount, { from: accounts[1] })
  }
}
