require("dotenv").config(); // Load environment variables from .env

const { ethers } = require("ethers");
const { JsonRpcProvider, Wallet, Contract } = require("ethers");

// Load contract ABI and address
const contractABI = require("../contracts/neoEterna.json").abi;
const contractAddress = process.env.CONTRACT_ADDRESS;

// Create provider using Alchemy or any other RPC endpoint
const provider = new JsonRpcProvider(process.env.ALCHEMY_URL);

// Sign transactions with private key from .env
const signer = new Wallet(process.env.PRIVATE_KEY, provider);

// Create contract instance to interact with the deployed smart contract
const neoEterna = new Contract(contractAddress, contractABI, signer);

/**
 * Mint a new capsule NFT on-chain.
 * Calls the smart contract method `mintCapsule`.
 * 
 * @param {Object} data - Capsule metadata and configuration
 * @returns {string} - The transaction hash once confirmed
 */
async function mintCapsuleOnChain({
  walletAddress,
  encryptedDataURI,
  title,
  description,
  category,
  unlockTimestamp,
  heir,
  fileHash
}) {
  try {
    // Call the mintCapsule method from the contract
    const tx = await neoEterna.mintCapsule(
      encryptedDataURI,
      unlockTimestamp,
      title,
      description,
      category,
      heir,
      fileHash,
      { from: walletAddress } // Specify transaction origin
    );

    console.log("🧾 Mint Tx Hash:", tx);

    // Wait for transaction confirmation
    await tx.wait();

    // Return the confirmed transaction hash
    return tx.hash;
  } catch (error) {
    console.error("❌ Error minting capsule:", error);
    throw error;
  }
}

/**
 * Retrieve all NFT token IDs owned by a given wallet.
 * 
 * @param {string} walletAddress - Ethereum address of the user
 * @returns {string[]} - List of token IDs as strings
 */
async function getNFTsOfWallet(walletAddress) {
  const balance = await neoEterna.balanceOf(walletAddress); // Get total NFTs owned
  const tokenIds = new Set();

  for (let i = 0; i < balance; i++) {
    const tokenId = await neoEterna.tokenOfOwnerByIndex(walletAddress, i);
    tokenIds.add(tokenId.toString());
  }

  return Array.from(tokenIds);
}

/**
 * Transfer an NFT from one wallet to another.
 * 
 * @param {string} from - Sender's address
 * @param {string} to - Receiver's address
 * @param {string|number} tokenId - NFT token ID to transfer
 */
async function transferNFT(from, to, tokenId) {
  console.log("🚚 Transferring NFT from:", from, "to:", to, "tokenId:", tokenId);

  // Validate addresses
  if (!from || !to || !ethers.isAddress(from) || !ethers.isAddress(to)) {
    throw new Error("Invalid 'from' or 'to' address.");
  }

  // Execute transfer
  const tx = await neoEterna.transferFrom(from, to, tokenId);
  return await tx.wait();
}

/**
 * Assign the NFT to its heir using smart contract logic.
 * Typically used for time-locked or legacy transfers.
 * 
 * @param {string} owner - Current owner's address (not used directly here)
 * @param {string} heir - Heir's address (handled inside the contract)
 * @param {string|number} tokenId - NFT token ID to inherit
 */
async function setInheritance(owner, heir, tokenId) {
  const tx = await neoEterna.transferToHeir(tokenId);
  return await tx.wait();
}

/**
 * Get details of a blockchain transaction using its hash.
 * 
 * @param {string} txHash - Transaction hash to query
 * @returns {Object} - Ethers transaction object
 */
async function getTransaction(txHash) {
  return await provider.getTransaction(txHash);
}

// Export all blockchain utility functions
module.exports = {
  mintCapsuleOnChain,
  getNFTsOfWallet,
  transferNFT,
  setInheritance,
  getTransaction
};
