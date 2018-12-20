pragma solidity ^0.4.24;

import "../node_modules/zeppelin-solidity/contracts/token/ERC721/ERC721Token.sol";
import "../node_modules/zeppelin-solidity/contracts/ownership/Ownable.sol";

contract MyERC721 is ERC721Token, Ownable {

    // mapping (address => uint256[]) internal ownedTokens;
    // mapping (uint256 => uint256) internal ownedTokensIndex;
    // mapping (uint256 => string) internal tokenURIs;


    constructor (string _name, string _symbol) public ERC721Token(_name, _symbol)  {
        owner = msg.sender;
    }

    /**
    * Custom accessor to create a unique token
    */
    function mintUniqueTokenTo(
        address _to,
        uint256 _tokenId,
        string  _tokenURI
    ) public  onlyOwner { 
        require(super.exists(_tokenId) == false, "Token ID must be unique.");
        super._mint(_to, _tokenId);                 // ERC721Token.sol
        super._setTokenURI(_tokenId, _tokenURI);    // ERC721Token.sol
    } 

}