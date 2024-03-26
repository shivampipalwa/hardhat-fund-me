const { network } = require("hardhat");
const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");
const { networkConfig } = require("../../helper-hardhat-config");
const MockV3AggregatorModule = require("./test/deploy-mocks");

module.exports = buildModule("FundMe", (m) => {
    const chainID = network.config.chainId;

    let ethUsdPriceFeedAdd;
    if (chainID == 31337) {
        console.log("Local network detected. Deploying Mocks...");
        const { MockV3Aggregator } = m.useModule(MockV3AggregatorModule);
        ethUsdPriceFeedAdd = MockV3Aggregator;
    } else {
        ethUsdPriceFeedAdd = networkConfig[chainID]["ethUsdPriceFeed"];
    }
    const fundMe = m.contract("FundMe", [ethUsdPriceFeedAdd]);

    return { fundMe };
});
