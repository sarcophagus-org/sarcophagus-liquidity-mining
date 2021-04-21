/* global artifacts */

const LiquidityMiningLP = artifacts.require('LiquidityMiningLP')
const LPMock = artifacts.require('DaiMock')
const SarcoMock = artifacts.require('SarcoMock')

module.exports = async function (deployer, network) {
  let lpAddress, sarcoAddress

  if (['mainnet', 'mainnet-fork'].includes(network)) {
    lpAddress = '0x8d3c9f4d0a8dbb6d5e2068ac36719290f7988cc1'
    sarcoAddress = '0x7697b462a7c4ff5f8b55bdbc2f4076c2af9cf51a'
  } else {
    await deployer.deploy(LPMock)
    await deployer.deploy(SarcoMock)

    lpAddress = (await LPMock.deployed()).address
    sarcoAddress = (await SarcoMock.deployed()).address
  }

  await deployer.deploy(LiquidityMiningLP, lpAddress, sarcoAddress)
}
