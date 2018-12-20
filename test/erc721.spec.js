import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
chai.use(chaiAsPromised);
const { expect, assert } = chai;

var MyERC721 = artifacts.require("MyERC721");

const NO_ADDRESS = '0x0000000000000000000000000000000000000000';

contract('Testing ERC721 contract',  (accounts) => {
    let token;
    
    const owner = accounts[0];

    const name = "BlueCat";
    const symbol = "BCat" 

    const ACCOUNT_1 = accounts[1]
    const TOKEN_ID_1 = 1111;
    const TOKEN_URI_1 = "This is data for the token 1"; // Does not have to be unique

    const ACCOUNT_2 = accounts[2]
    const TOKEN_ID_2 = 2222;
    const TOKEN_URI_2 = "This is data for the token 2"; // Does not have to be unique

    const ACCOUNT_3 = accounts[3]
    const TOKEN_ID_3 = 3333;
    const TOKEN_URI_3 = "This is data for the token 3";

    const TOKEN_ID_4 = 4444;
    const TOKEN_URI_4 = "This is data for the token 4";

    const TOKEN_ID_5 = 5555;
    const TOKEN_URI_5 = "This is data for the token 5";  

    describe("Creating/Minting Tokens", () => {
        it('should be able to mint unique tokens', async () => {
            token = await MyERC721.new(name, symbol) 
            
            await token.mintUniqueTokenTo(ACCOUNT_1, TOKEN_ID_1, TOKEN_URI_1, {from: owner})  

            try {
                await token.mintUniqueTokenTo(ACCOUNT_2, TOKEN_ID_1, TOKEN_URI_2, {from: owner})  
                assert.fail("Should not permint duplicate entry token Id");
            } catch (err) {
                assert.ok(/rever/.test(err.message));
            }  

            let totalSupply = await token.totalSupply();
            assert.equal(totalSupply.toNumber(), 1, "Only 1 token should be listed");
        }) 

        it('should provide ability for owner to own multiple tokens ', async () => {
           
            await token.mintUniqueTokenTo(ACCOUNT_1, TOKEN_ID_2, TOKEN_URI_2, {from: owner})  
 
            await token.mintUniqueTokenTo(ACCOUNT_1, TOKEN_ID_3, TOKEN_URI_3, {from: owner}) 

            // we could have token_uri contains some kind of metadata 
            const token_uri_4_metadata = '{ "title": "My Residence","address":"123 Main St. Anytown, AnyState", "uri": "http://trulia.com/house/2345323442"}';
            await token.mintUniqueTokenTo(ACCOUNT_2, TOKEN_ID_4, token_uri_4_metadata, {from: owner}) 

            let totalSupply = await token.totalSupply();
            assert.equal(totalSupply.toNumber(), 4, "Only 4 tokens should be listed");

            let token_uri = await token.tokenURI(TOKEN_ID_1);
            assert.equal(token_uri, TOKEN_URI_1, "URI data should be '" + TOKEN_URI_1 +"'");

            token_uri = await token.tokenURI(TOKEN_ID_4);
            assert.equal(token_uri, token_uri_4_metadata, "URI data should be '" + token_uri_4_metadata +"'");

            // console.log(token_uri);
            // let data = JSON.parse(token_uri);
            // console.log(data.title);
            // console.log(data.address);
            // console.log(data.uri);

            // we want to know who owns a certain token based on token ID
            let tokenOwner = await token.ownerOf(TOKEN_ID_1);
            assert.equal(tokenOwner, ACCOUNT_1, "Token 1 should be owned by " + ACCOUNT_1);

            let noOfOwnedTokens = await token.balanceOf(ACCOUNT_1);
            assert.equal(noOfOwnedTokens, 3, "Owner " + ACCOUNT_1 + " should own 3 tokens");

            let ownerTokenId = await token.tokenOfOwnerByIndex(ACCOUNT_1,0);
            assert.equal(ownerTokenId.toNumber(), TOKEN_ID_1, "First token Id for owner " + ACCOUNT_1 + " should be " + TOKEN_ID_1);

            ownerTokenId = await token.tokenOfOwnerByIndex(ACCOUNT_1,1);
            assert.equal(ownerTokenId.toNumber(), TOKEN_ID_2, "Second token Id for owner " + ACCOUNT_1 + " should be " + TOKEN_ID_2);
            
            ownerTokenId = await token.tokenOfOwnerByIndex(ACCOUNT_1,2);
            assert.equal(ownerTokenId.toNumber(), TOKEN_ID_3, "Third token Id for owner " + ACCOUNT_1 + " should be " + TOKEN_ID_3);
        }) 

    });

    describe("Simple Transfer of Tokens", () => {
        it('should be able for owner to transfer token', async () => {
            token = await MyERC721.new(name, symbol) 
            
            await token.mintUniqueTokenTo(owner, TOKEN_ID_1, TOKEN_URI_1, {from: owner})  
            await token.mintUniqueTokenTo(owner, TOKEN_ID_2, TOKEN_URI_2, {from: owner})   
            await token.mintUniqueTokenTo(owner, TOKEN_ID_3, TOKEN_URI_3, {from: owner}) 
            await token.mintUniqueTokenTo(owner, TOKEN_ID_4, TOKEN_URI_4, {from: owner}) 
            await token.mintUniqueTokenTo(owner, TOKEN_ID_5, TOKEN_URI_5, {from: owner}) 

            // Check the current tokens

            //Total number of tokens in the contract (regardless of owners)
            let totalSupply = await token.totalSupply();  
            assert.equal(totalSupply.toNumber(), 5, "Only 5 tokens should be listed"); 

            // Number of tokens by owner
            let noOfOwnedTokens = await token.balanceOf(owner); // mapping (address => uint256) internal ownedTokensCount
            assert.equal(noOfOwnedTokens.toNumber(), 5, "Owner " + owner + " should own 5 tokens");
  
            // Number of tokens by Account 1
            noOfOwnedTokens = await token.balanceOf(ACCOUNT_1);  
            assert.equal(noOfOwnedTokens.toNumber(), 0, "Account 1 " + ACCOUNT_1 + " should have no token");

            // Detailed queries on owner's individual tokens
            let registered_token_id = await token.tokenOfOwnerByIndex(owner, 0);
            assert.equal(registered_token_id.toNumber(), TOKEN_ID_1, "Account owner " + owner + " Token 1 should have index 0");    

            registered_token_id = await token.tokenOfOwnerByIndex(owner, 1);
            assert.equal(registered_token_id.toNumber(), TOKEN_ID_2, "Account owner " + owner + " Token 2 should have index 1"); 

            registered_token_id = await token.tokenOfOwnerByIndex(owner, 2);
            assert.equal(registered_token_id.toNumber(), TOKEN_ID_3, "Account owner " + owner + " Token 2 should have index 2"); 

            registered_token_id = await token.tokenOfOwnerByIndex(owner, 3);
            assert.equal(registered_token_id.toNumber(), TOKEN_ID_4, "Account owner " + owner + " Token 3 should have index 3"); 

            registered_token_id = await token.tokenOfOwnerByIndex(owner, 4);
            assert.equal(registered_token_id.toNumber(), TOKEN_ID_5, "Account owner " + owner + " Token 3 should have index 4"); 

            try {
                registered_token_id = await token.tokenOfOwnerByIndex(owner, 5);
                // console.log(registered_token_id);
                assert.fail("Owner token index 5 should not exist.");
            } catch (err) {
                assert.ok(/rever/.test(err.message));
            }  


            // Transfer token 1 by owner to account 1
            await token.transferFrom(owner, ACCOUNT_1, TOKEN_ID_1);    



            // Nothing should change here
            totalSupply = await token.totalSupply();  
            assert.equal(totalSupply.toNumber(), 5, "Total supply of tokens should still be 5"); 

            // Number of tokens by owner
            noOfOwnedTokens = await token.balanceOf(owner); 
            assert.equal(noOfOwnedTokens.toNumber(), 4, "Owner " + owner + " should no have 4 tokens");

            // Number of tokens by Account 1
            noOfOwnedTokens = await token.balanceOf(ACCOUNT_1);  
            assert.equal(noOfOwnedTokens.toNumber(), 1, "Account 1 " + ACCOUNT_1 + " should now have 1 token");

            // Detailed queries on owner's individual tokens

            // To prevent a gap in the array, we store the last token in the index of the token to delete, and
            // then delete the last slot.

            registered_token_id = await token.tokenOfOwnerByIndex(owner, 0);
            assert.equal(registered_token_id.toNumber(), TOKEN_ID_5, "Account owner " + owner + " Token index 3 should have token ID " + TOKEN_ID_5);
 
            registered_token_id = await token.tokenOfOwnerByIndex(owner, 1); 
            assert.equal(registered_token_id.toNumber(), TOKEN_ID_2, "Account owner " + owner + " Token index 0 should have token ID " + TOKEN_ID_2);    

            registered_token_id = await token.tokenOfOwnerByIndex(owner, 2);
            assert.equal(registered_token_id.toNumber(), TOKEN_ID_3, "Account owner " + owner + " Token index 1 should have token ID " + TOKEN_ID_3); 

            registered_token_id = await token.tokenOfOwnerByIndex(owner, 3);
            assert.equal(registered_token_id.toNumber(), TOKEN_ID_4, "Account owner " + owner + " Token index 2 should have token ID " + TOKEN_ID_4);
     
            try {
                registered_token_id = await token.tokenOfOwnerByIndex(owner, 4);
                // console.log(registered_token_id);
                assert.fail("Owner token index 4 should not existed.");
            } catch (err) {
                assert.ok(/rever/.test(err.message));
            }  
 
            registered_token_id = await token.tokenOfOwnerByIndex(ACCOUNT_1, 0);
            assert.equal(registered_token_id.toNumber(), TOKEN_ID_1, "Account " + ACCOUNT_1 + " should now own " + TOKEN_ID_1);
            try {
                registered_token_id = await token.tokenOfOwnerByIndex(ACCOUNT_1, 1); 
                assert.fail("Account 1 token index 1 should not existed.");
            } catch (err) {
                assert.ok(/rever/.test(err.message));
            }  
        })          
    });

    describe("Delegation of Transfer of Tokens", () => {
        it('should be able delegate transfer token on behalf of the owner', async () => {
            token = await MyERC721.new(name, symbol) 
            
            await token.mintUniqueTokenTo(owner, TOKEN_ID_1, TOKEN_URI_1, {from: owner})  
            await token.mintUniqueTokenTo(owner, TOKEN_ID_2, TOKEN_URI_2, {from: owner})  
            // Check the current tokens

            //Total number of tokens in the contract (regardless of owners)
            let totalSupply = await token.totalSupply();  
            assert.equal(totalSupply.toNumber(), 2, "Only 2 tokens should be listed"); 

            // Number of tokens by owner
            let noOfOwnedTokens = await token.balanceOf(owner);  
            assert.equal(noOfOwnedTokens, 2, "Owner " + owner + " should own 2 tokens");
 
            // Give approval for transfer of token 1 to Account 1
            await token.approve(ACCOUNT_1, TOKEN_ID_1);

            // Nothing should change
            totalSupply = await token.totalSupply();  
            assert.equal(totalSupply.toNumber(), 2, "Only 2 tokens should be listed after approval"); 

            // Number of tokens by owner
            noOfOwnedTokens = await token.balanceOf(owner);  
            assert.equal(noOfOwnedTokens, 2, "Owner " + owner + " should own 2 tokens after approval");
 
            // Check the approval of ACCOUNT 1 on TOKEN ID 1
            let operatorAddr = await token.getApproved(TOKEN_ID_1);
            assert.equal(operatorAddr, ACCOUNT_1, "Operator's address for token ID " + TOKEN_ID_1  + " should be account 1: " + ACCOUNT_1);
            
            operatorAddr = await token.getApproved(TOKEN_ID_2);            
            assert.equal( operatorAddr, NO_ADDRESS, "Token 2 " + TOKEN_ID_2 + " should not be approved for transfer");  

        });
        
        it('should be able transfer token on behalf of the owner by the operator', async () => {
             
            let totalSupply = await token.totalSupply();  
            assert.equal(totalSupply.toNumber(), 2, "Only 2 tokens should be listed"); 

            // Number of tokens by owner
            let noOfOwnedTokens = await token.balanceOf(owner);  
            assert.equal(noOfOwnedTokens, 2, "Owner " + owner + " should own 2 tokens");
 

            // Detailed queries on owner's individual tokens

            let registered_token_id = await token.tokenOfOwnerByIndex(owner, 0);
            assert.equal(registered_token_id.toNumber(), TOKEN_ID_1, "Account owner " + owner + " Token 1 should have index 0");    

            registered_token_id = await token.tokenOfOwnerByIndex(owner, 1);
            assert.equal(registered_token_id.toNumber(), TOKEN_ID_2, "Account owner " + owner + " Token 2 should have index 1");    


            // Number of tokens in account 2
            noOfOwnedTokens = await token.balanceOf(ACCOUNT_2);  
            assert.equal(noOfOwnedTokens, 0, "Account 2 should have not token before transfer");


            await token.transferFrom(owner, ACCOUNT_2, TOKEN_ID_1, {from: ACCOUNT_1});
            

            totalSupply = await token.totalSupply();  
            assert.equal(totalSupply.toNumber(), 2, "Only 2 tokens should be listed after transfer"); 

            noOfOwnedTokens = await token.balanceOf(owner);  
            assert.equal(noOfOwnedTokens, 1, "Owner " + owner + " should reduced to 1 token");

            registered_token_id = await token.tokenOfOwnerByIndex(owner, 0);
            assert.equal(registered_token_id.toNumber(), TOKEN_ID_2, "Account owner " + owner + " Token 1 should have index 0");    
            try {
                registered_token_id = await token.tokenOfOwnerByIndex(owner, 1);
                assert.fail("Owner token index 1 does not exists anymore.");
            } catch (err) {
                assert.ok(/rever/.test(err.message));
            }    
             
            // token ownership is transferred to ACCOUNT_2
            registered_token_id = await token.tokenOfOwnerByIndex(ACCOUNT_2, 0);
            assert.equal(registered_token_id.toNumber(), TOKEN_ID_1, "Account 2 " + ACCOUNT_2 + " Token 1 should have index 0");  

        });    
    });
});