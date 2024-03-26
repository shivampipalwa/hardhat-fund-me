const { getNamedAccounts, ethers } = require("hardhat");

async function main() {
    const { deployer } = await getNamedAccounts();
    const fundMe = await ethers.getContract("FundMe", deployer);
    console.log(`Got contract FundMe at ${fundMe.address}`);
    console.log("Funding contract...");
    const transactionResponse = fundMe.fund({ value: "10000000000000000" });
    await transactionResponse.wait;
    console.log("Funded!!");
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
