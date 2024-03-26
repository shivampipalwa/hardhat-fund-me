const { version } = require("chai");
const { vars } = require("hardhat/config");

require("@nomicfoundation/hardhat-toolbox");
require("@nomicfoundation/hardhat-ethers");
require("hardhat-deploy");
require("hardhat-deploy-ethers");
/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
    solidity: {
        compilers: [{ version: "0.8.8" }, { version: "0.6.6" }],
    },
    networks: {
        sepolia: {
            url: vars.get("SEPOLIA_RPC_URL"),
            accounts: [vars.get("SEPOLIA_ACC_1")],
            chainId: 11155111,
            blockConfirmations: 6,
        },
    },
    etherscan: {
        apiKey: {
            sepolia: vars.get("ETHERSCAN_API_KEY"),
        },
    },
    namedAccounts: {
        deployer: {
            default: 0,
        },
        user: {
            default: 1,
        },
    },
    gasReporter: {
        enabled: true,
        outputFile: "gas-report.txt",
        noColors: true,
        currency: "USD",
        coinmarketcap: vars.get("COINMARKETCAP_API_KEY"),
        chain: "ETH",
    },
};
