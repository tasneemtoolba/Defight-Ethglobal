require("@nomicfoundation/hardhat-toolbox");

const privateKey = process.env.PRIVATE_KEY;

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: {
    version: "0.8.35",
    settings: {
      optimizer: { enabled: true, runs: 200 },
    },
  },
  networks: {
    zerog: {
      url: process.env.ZEROG_RPC_URL || "https://evmrpc.0g.ai",
      chainId: 16661,
      ...(privateKey ? { accounts: [privateKey] } : {}),
    },
  },
};
