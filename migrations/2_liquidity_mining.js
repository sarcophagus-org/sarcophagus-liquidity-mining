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
    sarcoAddress = '0x7697b462a7c4ff5f8b55bdbc2f4076c2af9cf51a'
    
    // yikes, what is this all about
    // c'mon truffle
    if (network === 'mainnet-fork') {
      ownerAddress = deployer.provider.options.unlocked_accounts[0]
    } else if (network === 'mainnet') {
      ownerAddress = accounts[0]
    } else {
      console.error('which network are we on?', network)
      process.exit(1)
    }
  } else if (['goerli', 'goerli-fork'].includes(network)) {
    await deployer.deploy(SarcoMock)
    sarcoAddress = (await SarcoMock.deployed()).address

    usdcAddress = '0x92321c730f047bb289c2b37e5a5fdd891e660f0b'
    usdtAddress = '0x479051fecbf65b3a1ecab1d01f200c88fc83cc41'
    daiAddress = '0xb174bfb76d9b5b3b394d33057fd08f84151047b4'

    // yikes, what is this all about
    // c'mon truffle
    if (network === 'goerli-fork') {
      ownerAddress = deployer.provider.options.unlocked_accounts[0]
    } else if (network === 'goerli') {
      ownerAddress = accounts[0]
    } else {
      console.error('which network are we on?', network)
      process.exit(1)
    }
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
