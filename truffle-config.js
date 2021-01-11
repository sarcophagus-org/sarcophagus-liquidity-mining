require('dotenv').config({ path: './.env.local' })
const HDWalletProvider = require('@truffle/hdwallet-provider')

module.exports = {
  contracts_build_directory: 'build-contracts',
  networks: {
    mainnet: {
      provider: () => new HDWalletProvider({
        privateKeys: [process.env.MAINNET_PK],
        providerOrUrl: process.env.MAINNET_PROVIDER
      }),
      network_id: '1',
    },
    goerli: {
      provider: () => new HDWalletProvider({
        privateKeys: [process.env.GOERLI_PK],
        providerOrUrl: process.env.GOERLI_PROVIDER
      }),
      network_id: '5',
    },
  },
  mocha: {},
  compilers: {
    solc: {
      version: '0.6.12',
      settings: {
        optimizer: {
          enabled: true,
          runs: 1000
        }
      }
    }
  }
}
