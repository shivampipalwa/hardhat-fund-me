const { assert, expect } = require("chai");
const { deployments, ethers, getNamedAccounts } = require("hardhat");
const { developmentChains } = require("../../helper-hardhat-config");

!developmentChains.includes(network.name)
    ? describe.skip
    : describe("FundMe", function () {
          let fundMe;
          let fundMeAddress;
          let deployer;
          let mockV3Aggregator;
          // const sendValue = ethers.utils.parseEther("1.0").toString(); //1ETH
          const sendValue = "1000000000000000000"; //1ETH

          beforeEach(async function () {
              //deploy fundme using hardha deploy
              // const accounts = ethers.getSigners()
              // const accountone = accounts[1];
              deployer = (await getNamedAccounts()).deployer;
              await deployments.fixture(["all"]);
              fundMe = await ethers.getContract("FundMe", deployer);
              fundMeAddress = await fundMe.getAddress();
              mockV3Aggregator = await ethers.getContract(
                  "MockV3Aggregator",
                  deployer,
              );
          });

          describe("constructor", function () {
              it("sets the aggregator addresses correctly", async function () {
                  const response = await fundMe.s_priceFeed();
                  const expected = await mockV3Aggregator.getAddress();
                  assert.equal(response, expected);
              });
          });

          describe("fund", function () {
              it("Fails if you dont send enough ETH", async function () {
                  await expect(fundMe.fund()).to.be.revertedWith(
                      "Did not recieve enough ETH!!",
                  );
              });
              it("Updates the AmountFunded data structure", async function () {
                  await fundMe.fund({ value: sendValue });
                  const response =
                      await fundMe.s_addressToAmountFunded(deployer);
                  assert.equal(sendValue.toString(), response.toString());
              });
              it("Adds funder to s_funders array", async function () {
                  await fundMe.fund({ value: sendValue });
                  const response = await fundMe.s_funders(0);
                  assert.equal(response, deployer);
              });
          });

          describe("withdraw", function () {
              beforeEach(async function () {
                  await fundMe.fund({ value: sendValue });
              });

              it("withdraws ETH from a single founder", async function () {
                  //Arrange
                  const startingFundMeBalance =
                      await ethers.provider.getBalance(fundMeAddress);
                  const startingDeployerBalance =
                      await ethers.provider.getBalance(deployer);

                  //Act
                  const transactionResponse = await fundMe.withdraw();
                  const transactionReceipt = await transactionResponse.wait();

                  const endingFundMeBalance =
                      await ethers.provider.getBalance(fundMeAddress);
                  const endingDeployerBalance =
                      await ethers.provider.getBalance(deployer);

                  const { gasUsed, gasPrice } = transactionReceipt;
                  const gasCost = gasUsed * gasPrice;

                  //Assert
                  assert.equal(endingFundMeBalance, 0);
                  assert.equal(
                      (
                          startingFundMeBalance + startingDeployerBalance
                      ).toString(),
                      (endingDeployerBalance + gasCost).toString(),
                  );
              });

              it("cheaperWithdraw single funder", async function () {
                  //Arrange
                  const startingFundMeBalance =
                      await ethers.provider.getBalance(fundMeAddress);
                  const startingDeployerBalance =
                      await ethers.provider.getBalance(deployer);

                  //Act
                  const transactionResponse = await fundMe.cheaperWithdraw();
                  const transactionReceipt = await transactionResponse.wait();

                  const endingFundMeBalance =
                      await ethers.provider.getBalance(fundMeAddress);
                  const endingDeployerBalance =
                      await ethers.provider.getBalance(deployer);

                  const { gasUsed, gasPrice } = transactionReceipt;
                  const gasCost = gasUsed * gasPrice;

                  //Assert
                  assert.equal(endingFundMeBalance, 0);
                  assert.equal(
                      (
                          startingFundMeBalance + startingDeployerBalance
                      ).toString(),
                      (endingDeployerBalance + gasCost).toString(),
                  );
              });

              it("withdraws ETH from multiple s_funders", async function () {
                  //Arrange
                  const accounts = await ethers.getSigners();
                  for (let i = 1; i < 5; i++) {
                      fundMeConnected = await fundMe.connect(accounts[i]);
                      await fundMeConnected.fund({ value: sendValue });
                  }
                  const startingFundMeBalance =
                      await ethers.provider.getBalance(fundMeAddress);
                  const startingDeployerBalance =
                      await ethers.provider.getBalance(deployer);

                  //Act
                  const transactionResponse = await fundMe.withdraw();
                  const transactionReceipt = await transactionResponse.wait();

                  const endingFundMeBalance =
                      await ethers.provider.getBalance(fundMeAddress);
                  const endingDeployerBalance =
                      await ethers.provider.getBalance(deployer);

                  const { gasUsed, gasPrice } = transactionReceipt;
                  const gasCost = gasUsed * gasPrice;

                  //Assert
                  assert.equal(endingFundMeBalance, 0);
                  assert.equal(
                      (
                          startingFundMeBalance + startingDeployerBalance
                      ).toString(),
                      (endingDeployerBalance + gasCost).toString(),
                  );

                  //s_funders array is reset properly
                  await expect(fundMe.s_funders(0)).to.be.reverted;

                  for (let i = 1; i < 5; i++) {
                      assert.equal(
                          await fundMe.s_addressToAmountFunded(accounts[i]),
                          0,
                      );
                  }
              });
              it("cheaperWithdraw TESTING ....", async function () {
                  //Arrange
                  const accounts = await ethers.getSigners();
                  for (let i = 1; i < 5; i++) {
                      fundMeConnected = await fundMe.connect(accounts[i]);
                      await fundMeConnected.fund({ value: sendValue });
                  }
                  const startingFundMeBalance =
                      await ethers.provider.getBalance(fundMeAddress);
                  const startingDeployerBalance =
                      await ethers.provider.getBalance(deployer);

                  //Act
                  const transactionResponse = await fundMe.cheaperWithdraw();
                  const transactionReceipt = await transactionResponse.wait();

                  const endingFundMeBalance =
                      await ethers.provider.getBalance(fundMeAddress);
                  const endingDeployerBalance =
                      await ethers.provider.getBalance(deployer);

                  const { gasUsed, gasPrice } = transactionReceipt;
                  const gasCost = gasUsed * gasPrice;

                  //Assert
                  assert.equal(endingFundMeBalance, 0);
                  assert.equal(
                      (
                          startingFundMeBalance + startingDeployerBalance
                      ).toString(),
                      (endingDeployerBalance + gasCost).toString(),
                  );

                  //s_funders array is reset properly
                  await expect(fundMe.s_funders(0)).to.be.reverted;

                  for (let i = 1; i < 5; i++) {
                      assert.equal(
                          await fundMe.s_addressToAmountFunded(accounts[i]),
                          0,
                      );
                  }
              });
              it("only allows owner to withdraw", async function () {
                  const accounts = await ethers.getSigners();
                  const attacker = accounts[1];
                  const attackerConnectedContract = fundMe.connect(attacker);
                  await expect(
                      attackerConnectedContract.withdraw(),
                  ).to.be.revertedWithCustomError(fundMe, "FundMe__NotOwner");
              });
          });
      });

//IGNITION
// const { ignition } = require("hardhat");
// const FundMeModule = require("../../ignition/modules/FundMe");

// describe("FundMe", async function () {
//     beforeEach(async function () {
//         //deploy FundMe using ignition
//         const { FundMe } = await ignition.deploy(FundMeModule);
//     });

//     describe("constructor", async function () {

//     });
// });
