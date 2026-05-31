const express = require("express");
const router = express.Router();
const nftController = require("../controllers/nftController");

// GET /api/nft/detail/:capsuleId
// Retrieve the NFT metadata using the associated capsule ID
router.get("/detail/:capsuleId", nftController.getNFTByCapsuleId);

// GET /api/nft/capsule/:mintTxHash
// Fetch capsule details from a given NFT's mint transaction hash
router.get("/capsule/:mintTxHash", nftController.getCapsuleFromNFT);

// POST /api/nft/transfer
// Transfer NFT ownership to another wallet address
router.post("/transfer", nftController.transferNFT);

// POST /api/nft/inherit
// Assign an NFT to a beneficiary (inheritance setup)
router.post("/inherit", nftController.setupInheritance);

// GET /api/nft/tx/:txHash
// Get on-chain status of a blockchain transaction using its hash
router.get("/tx/:txHash", nftController.getTransactionStatus);

// GET /api/nft/unlock/:id
// Unlock and download the content of an NFT if it's eligible
router.get("/unlock/:id", nftController.unlockNFT);

// GET /api/nft/:address
// Fetch all NFTs owned by a specific wallet address
router.get("/:address", nftController.getNFTsByAddress);

// Export the configured router to be used in the main app
module.exports = router;
