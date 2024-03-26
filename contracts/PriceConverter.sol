// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import {AggregatorV3Interface} from "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";

library PriceConverter {
    function getPrice(
        AggregatorV3Interface priceFeed
    ) internal view returns (uint256) {
        //interact with outside contract , we need:
        //1) ABI

        //dont need to get the entire contract we just need the abi
        //we use "Interface" for this-> gives minimilistic abi by taking address as input
        //directly import from github using npm

        //2) adress : 0x694AA1769357215DE4FAC081bf1f309aDC325306

        // AggregatorV3Interface priceFeed = AggregatorV3Interface(
        //     0x694AA1769357215DE4FAC081bf1f309aDC325306
        // );
        (, int answer, , , ) = priceFeed.latestRoundData(); //ETH in terms of USD with 8 decimal
        return uint256(answer * 1e10); // asmsg.valu is in wei ie 1e-18 eth
    }

    function getConversionRate(
        uint256 ethAmount,
        AggregatorV3Interface priceFeed
    ) internal view returns (uint256) {
        uint256 inUSD = (ethAmount * getPrice(priceFeed)) / 1e18;
        return inUSD;
    }
}
