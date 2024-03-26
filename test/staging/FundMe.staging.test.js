const { assert } = require("chai");
const { network, ethers, getNamedAccounts } = require("hardhat");
const { developmentChains } = require("../../helper-hardhat-config");

developmentChains.includes(network.name)
    ? describe.skip
    : describe("FundMe Staging Tests", function () {
          let deployer;
          let fundMe;
          const sendValue = "100000000000000000";
          beforeEach(async () => {
              deployer = (await getNamedAccounts()).deployer;
              fundMe = await ethers.getContract("FundMe", deployer);
              fundMeAddress = await fundMe.getAddress();
          });

          it("allows people to fund and withdraw", async function () {
              const fundTxResponse = await fundMe.fund({ value: sendValue });
              await fundTxResponse.wait(1);
              const withdrawTxResponse = await fundMe.withdraw();
              await withdrawTxResponse.wait(1);

              const endingFundMeBalance =
                  await ethers.provider.getBalance(fundMeAddress);
              console.log(
                  endingFundMeBalance.toString() +
                      " should equal 0, running assert equal...",
              );
              assert.equal(endingFundMeBalance.toString(), "0");
          });
      });
