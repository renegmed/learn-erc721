const MyERC721 = artifacts.require("./MyERC721.sol");

module.exports = async (deployer) => {
  //await deployer.deploy(MyERC721);
  await deployer.deploy(MyERC721, "ME721", "My ERC721")
  // const erc721 = await MyERC721.deployed()
};
