const mongoose = require("mongoose");
const NFT = require("../models/nft");
const Capsule = require("../models/capsule");
const { getTransactionStatus } = require("../services/blockchainService");
const { decryptFile } = require("../utils/encryption");
const axios = require("axios");
const Log = require("../models/log");

// Retrieve capsule metadata using mint transaction hash
exports.getCapsuleFromNFT = async (req, res) => {
  try {
    const { mintTxHash } = req.params;

    // Find NFT by mint transaction hash
    const nft = await NFT.findOne({ mintTxHash });
    if (!nft) {
      return res.status(404).json({ success: false, message: "NFT not found" });
    }

    // Fetch corresponding capsule
    const capsule = await Capsule.findById(nft.capsuleId);
    if (!capsule) {
      return res.status(404).json({ success: false, message: "Capsule not found" });
    }

    res.status(200).json({
      success: true,
      capsule,
    });
  } catch (err) {
    console.error("❌ getCapsuleFromNFT failed:", err);
    res.status(500).json({ success: false, message: "Server error fetching capsule from NFT" });
  }
};

// Retrieve all NFTs owned by a specific wallet address
exports.getNFTsByAddress = async (req, res) => {
  try {
    const address = req.params.address.toLowerCase();

    // Find NFTs sorted by most recent first
    const nfts = await NFT.find({ owner: address }).sort({ createdAt: -1 });
    res.status(200).json(nfts);
  } catch (err) {
    console.error("❌ Failed to fetch NFTs:", err);
    res.status(500).json({ error: "Server error fetching NFTs" });
  }
};

// Retrieve NFT metadata by capsule ID
exports.getNFTByCapsuleId = async (req, res) => {
  try {
    const { capsuleId } = req.params;

    // Find NFT using its associated capsule ID
    const nft = await NFT.findOne({ capsuleId });
    if (!nft) {
      return res.status(404).json({ success: false, message: "NFT not found" });
    }
    res.status(200).json(nft);
  } catch (err) {
    console.error("❌ Failed to get NFT:", err);
    res.status(500).json({ error: "Failed to fetch NFT" });
  }
};

// Transfer NFT ownership to another address
exports.transferNFT = async (req, res) => {
  try {
    const { tokenId, to } = req.body;

    // Validate input
    if (!tokenId || !to) {
      return res.status(400).json({ error: "Missing tokenId or recipient address" });
    }

    // Find NFT and update owner
    const nft = await NFT.findOne({ tokenId });
    if (!nft) {
      return res.status(404).json({ error: "NFT not found" });
    }

    nft.owner = to.toLowerCase();
    nft.isTransferred = true;
    await nft.save();

    await Log.create({
  event: "NFT transferred",
  wallet: nft.inheritedFrom || nft.owner,
  capsuleId: nft.capsuleId,
});


    res.status(200).json({
      success: true,
      message: "NFT transferred successfully",
      nft,
    });
  } catch (err) {
    console.error("❌ Transfer failed:", err);
    res.status(500).json({ error: "NFT transfer failed" });
  }
};

// Assign an NFT to a beneficiary (inheritance)
exports.setupInheritance = async (req, res) => {
  try {
    const { tokenId, beneficiary } = req.body;

    // Validate input
    if (!tokenId || !beneficiary) {
      return res.status(400).json({ error: "Missing tokenId or beneficiary" });
    }

    // Find NFT and mark it as inherited
    const nft = await NFT.findOne({ tokenId });
    if (!nft) {
      return res.status(404).json({ error: "NFT not found" });
    }

    nft.isInherited = true;
    nft.inheritedFrom = nft.owner;
    nft.owner = beneficiary.toLowerCase();
    await nft.save();

    await Log.create({
  event: "NFT inherited",
  wallet: nft.inheritedFrom || nft.owner,
  capsuleId: nft.capsuleId,
});


    res.status(200).json({
      success: true,
      message: "NFT inheritance assigned successfully",
      nft,
    });
  } catch (err) {
    console.error("❌ Inheritance failed:", err);
    res.status(500).json({ error: "Inheritance setup failed" });
  }
};

// Fetch on-chain transaction status using hash
exports.getTransactionStatus = async (req, res) => {
  try {
    const { txHash } = req.params;

    // Call blockchain service to get transaction status
    const status = await getTransactionStatus(txHash);
    res.status(200).json({ status });
  } catch (err) {
    console.error("❌ Failed to check transaction:", err);
    res.status(500).json({ error: "Unable to fetch transaction status" });
  }
};

// Unlock NFT and serve decrypted file if conditions met
exports.unlockNFT = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id || id === "undefined") {
      return res.status(400).json({ success: false, message: "Invalid or missing NFT ID" });
    }
 
       // Build a safe query
    const query = {
      $or: [
        { tokenId: id },
        { mintTxHash: id }
      ]
    };
   // Only include capsuleId if id is a valid ObjectId
    if (mongoose.Types.ObjectId.isValid(id)) {
      query.$or.push({ capsuleId: id });
    }

    // Lookup NFT
    const nft = await NFT.findOne(query);
    if (!nft) {
      return res.status(404).json({ success: false, message: "NFT not found" });
    }
    // Check if unlock time has been reached
    const currentTime = Math.floor(Date.now() / 1000); // current time in seconds
    if (currentTime < nft.unlockTimestamp) {
      return res.status(403).json({
        success: false,
        message: "NFT is still locked. Unlock date not reached.",
        unlockTimestamp: nft.unlockTimestamp,
      });
    }

   // Download encrypted file from Arweave
    let fileResponse;

    try {
      // Attempt to download encrypted file from Arweave
      fileResponse = await axios.get(nft.encryptedDataURI, {
        responseType: "arraybuffer",
      });
    }  catch (err) {
      console.error("⚠️ Error fetching the encrypted file from Arweave:", nft.encryptedDataURI);
      return res.status(502).json({
        success: false,
        message: "File is not yet available on Arweave. Please try again in a few moments.",
      });
    }

    // Decrypt the downloaded file
    const decryptedBuffer = await decryptFile(fileResponse.data);

    // Return decrypted file as downloadable response
    res.set({
      "Content-Type": nft.mimeType || "application/octet-stream",
      "Content-Disposition": `attachment; filename="${nft.originalName || nft.title.replace(/ /g, "_")}"`,
    });    

    console.log("📦 Sending file:", nft.originalName);
    res.send(decryptedBuffer);

    await Log.create({
  event: "NFT unlocked",
  wallet: nft.owner,
  capsuleId: nft.capsuleId,
});

  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Failed to unlock NFT" });
  }
};
