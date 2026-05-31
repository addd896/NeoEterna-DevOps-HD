const { ethers } = require("hardhat");

async function main() {
  // Get the list of available signers (accounts) from Hardhat
  const [deployer] = await ethers.getSigners();

  // Log the deployer's wallet address
  console.log("🚀 Deploying contracts with the account:", deployer.address);

  // Get the contract factory for the NeoEterna smart contract
  // Assumes a contract named `neoEterna` exists in the contracts folder
  const TimeCapsule = await ethers.getContractFactory("neoEterna");

  // Deploy the contract to the current network
  const capsule = await TimeCapsule.deploy();

  // Wait for the deployment transaction to be mined and the contract to be available
  await capsule.waitForDeployment();

  // Log the deployed contract address
  console.log("✅ Neo Eterna deployed at:", await capsule.getAddress());
}

// Execute the main deployment function
main()
  .then(() => process.exit(0)) // Exit the process on successful deployment
  .catch((error) => {
    // Log any error encountered during deployment
    console.error("❌ Deployment failed:", error);
    process.exit(1); // Exit with error code
  });
