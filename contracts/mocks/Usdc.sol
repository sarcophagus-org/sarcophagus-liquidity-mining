// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.6.12;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract UsdcMock is ERC20 {
    constructor() public ERC20("Usdc Mock", "UsdcMock") {
        _mint(msg.sender, 1 * 10**6 * 10**18);
    }
}
