/* global artifacts */

const LiquidityMining = artifacts.require('LiquidityMining')
const UsdcMock = artifacts.require('UsdcMock')
const UsdtMock = artifacts.require('UsdtMock')
const DaiMock = artifacts.require('DaiMock')
const SarcoMock = artifacts.require('SarcoMock')

module.exports = async function (deployer, network, accounts) {
  let usdcAddress, usdtAddress, daiAddress, sarcoAddress, ownerAddress

  if (['mainnet', 'mainnet-fork'].includes(network)) {
    usdcAddress = '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48'
    usdtAddress = '0xdac17f958d2ee523a2206206994597c13d831ec7'
    daiAddress = '0x6b175474e89094c44da98b954eedeac495271d0f'
    sarcoAddress = ''
    ownerAddress = ''
    console.error('SARCO token and Owner DAO not deployed yet')
    process.exit(1)
  } else {
    await deployer.deploy(UsdcMock)
    await deployer.deploy(UsdtMock)
    await deployer.deploy(DaiMock)
    await deployer.deploy(SarcoMock)

    usdcAddress = (await UsdcMock.deployed()).address
    usdtAddress = (await UsdtMock.deployed()).address
    daiAddress = (await DaiMock.deployed()).address
    sarcoAddress = (await SarcoMock.deployed()).address
    
    ownerAddress = accounts[0]
  }

  await deployer.deploy(LiquidityMining, usdcAddress, usdtAddress, daiAddress, sarcoAddress, ownerAddress)
}
