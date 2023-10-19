require("@nomiclabs/hardhat-waffle");
require('dotenv').config();

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.20",
  networks: {
    avalancheTest: {
      url: process.env.RPC_ENDPOINT_AVAX,
      accounts: [process.env.DEV_PK],
    },
    mumbai: {
      url: process.env.RPC_ENDPOINT_POLYGON,
      accounts: [process.env.DEV_PK],
      gas: 2100000,
      gasPrice: 8000000000,
    },
  },
};