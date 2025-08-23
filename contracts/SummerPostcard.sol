// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract SummerPostcard is ERC721 {
    uint256 private _tokenIds; // simple counter

    mapping(uint256 => string) public postcardMessage;

    constructor() ERC721("SummerPostcard", "POST") {}

    function mintPostcard(string memory message) external {
        uint256 newId = _tokenIds;
        _safeMint(msg.sender, newId);
        postcardMessage[newId] = message;
        _tokenIds++;
    }
}
