// src/index.js
const Web3 = require('web3');
const { setupLoader } = require('@openzeppelin/contract-loader');
const BN = Web3.utils.BN

const from = "0x85b931a32a0725be14285b66f1a22178c672d69b"
const usdcAddress = '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48'
const usdtAddress = '0xdac17f958d2ee523a2206206994597c13d831ec7'
const daiAddress = '0x6b175474e89094c44da98b954eedeac495271d0f'

function timeout(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function makeBlock(web3) {
  return new Promise(resolve => {
    web3.currentProvider.send({ jsonrpc: "2.0", method: "evm_mine", id: Date.now() }, function() { resolve() })
  })
}

async function main() {
  // Set up web3 object
  const web3 = new Web3('http://localhost:8546')
  const loader = setupLoader({ 
    provider: web3, 
    artifactsDir: './build-contracts',
    defaultSender: from,
    defaultGas: 5000000,
  }).truffle;

  const Sarco = loader.fromArtifact("SarcoMock")
  const sarco = await Sarco.new()
  console.log("sarco addy:", sarco.address)

  const LiquidityMining = loader.fromArtifact('LiquidityMining2')
  const liquidityMining = await LiquidityMining.new(usdcAddress, usdtAddress, daiAddress, sarco.address, from)
  console.log("liqmin addy:", liquidityMining.address)

  const rewardAmount = (new BN(1000000)).mul(new BN(10).pow(new BN(18)))

  await sarco.transfer(liquidityMining.address, rewardAmount)
  
  await makeBlock(web3)
  const currentTime = (await web3.eth.getBlock('latest')).timestamp
  const startTime = currentTime + 1
  const endTime = startTime + 60 * 10
  await liquidityMining.deposit(rewardAmount, startTime, endTime)
  
  await timeout(2000)

  const usdcAmount = (new BN(100)).mul(new BN(10).pow(new BN(6)))
  const usdtAmount = (new BN(100)).mul(new BN(10).pow(new BN(6)))
  const daiAmount = (new BN(100)).mul(new BN(10).pow(new BN(18)))

  const ERC20 = loader.fromArtifact("ERC20")
  const usdc = await ERC20.at(usdcAddress)
  const usdt = await ERC20.at(usdtAddress)
  const dai = await ERC20.at(daiAddress)

  await usdc.approve(liquidityMining.address, usdcAmount.mul(new BN(2)))
  await usdt.approve(liquidityMining.address, usdtAmount.mul(new BN(2)))
  await dai.approve(liquidityMining.address, daiAmount.mul(new BN(2)))

  await liquidityMining.stake(usdcAmount, 0, 0)
  await liquidityMining.stake(0, usdtAmount, 0)
  await liquidityMining.stake(0, 0, daiAmount)
  await liquidityMining.stake(usdcAmount, usdtAmount, daiAmount)

  console.log("Done")
  process.exit(0)
}

main();