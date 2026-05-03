const { ethers } = require("hardhat");

async function main() {
    const [deployer] = await ethers.getSigners();
  
    console.log("Deploying with account:", deployer.address);

    const Benchmark = await ethers.getContractFactory("BTCPricePredictionBenchmark");
    const contract = await Benchmark.deploy();
  
   // await contract.deployed();
  
    console.log("Benchmark deployed to:", contract.address);
  }
  
  main()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });