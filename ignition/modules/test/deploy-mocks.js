// const { network } = require("hardhat");
const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");
const DECIMALS = "8";
const INITIAL_PRICE = "200000000000";

// console.log("Local network detected. Deploying Mocks...");

module.exports = buildModule("MockV3Aggregator", (m) => {
    const MockV3Aggregator = m.contract("MockV3Aggregator", [
        DECIMALS,
        INITIAL_PRICE,
    ]);
    // console.log("Deployed MockV3Aggregator!!");
    return { MockV3Aggregator };
});

// console.log("Mocks Deployed..");
