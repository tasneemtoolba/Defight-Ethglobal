/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.24",
};

require("@nomicfoundation/hardhat-toolbox");
// ethers plugin
//require('@nomiclabs/hardhat-ethers');
//require("@nomiclabs/hardhat-web3");


const privateKey = process.env.PRIVATE_KEY;



module.exports = {
  solidity: "0.8.35", // match your contract

  networks: {
    zerog: {
      url: "https://evmrpc.0g.ai", 
      chainId: 16661,
      accounts: [privateKey]
    }
  }
};