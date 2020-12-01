// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.6.12;

import "./ERC20CustomDecimals.sol";

contract UsdtMock is ERC20CustomDecimals {
    uint8 _decimals = 6;

    constructor() public ERC20CustomDecimals("Usdt Mock", "UsdtMock", _decimals) {
        _mint(msg.sender, 1 * 10**6 * 10**uint256(_decimals));
    }
}
