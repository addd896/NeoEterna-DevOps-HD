// Capsule controller handles creation, minting, unlocking, retrieval, and deletion of capsules
const { mintCapsuleOnChain } = require("../services/blockchainService");
const { encryptFile } = require("../utils/encryption");
const { decryptFile } = require("../utils/encryption");
const { uploadToBundlr } = require("../services/bundlrService");
const { verifyFile } = require("../services/aiService");
const Log = require("../models/log");

const NFT = require("../models/nft");
const Capsule  = require("../models/capsule");
const axios = require("axios");

// Create a new capsule
exports.createCapsule = async (req, res) => {
  try {
    const file = req.file;
    const { title, description, category, unlockTimestamp, heir } = req.body;

    // Ensure all required fields are present
    if (!file || !title || !description || !category || !unlockTimestamp || !heir) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // Step 1: Verify the file using AI service before storing
    const { result, confidence, error, message } = await verifyFile(file.buffer, file.originalname);

    // Handle AI verification error
    if (error) {
      return res.status(500).json({ success: false, message });
    }

    // Reject if file is likely forged
    if (result === "forged" && confidence > 0.8) {
      return res.status(400).json({
        success: false,
        message: `File verification failed. Possible forgery detected (${confidence * 100}%).`,
      });
    }

    // Step 2: Encrypt the file buffer
    const encryptedBuffer = await encryptFile(file.buffer);

    // Step 3: Upload encrypted file to Arweave through Bundlr
    const { uri, txHash } = await uploadToBundlr(encryptedBuffer);
    const encryptedDataURI = uri;
    const fileHash = uri.split("/").pop(); // hash needed for on-chain verification

    // Convert unlock date to Unix timestamp (in seconds)
    const unlockUnix = Math.floor(new Date(unlockTimestamp).getTime() / 1000); // convert to seconds

    // Log the decoded JWT payload
    console.log("🧠 Decoded JWT:", req.user);

    const userId = req.user?.userId;
    const walletAddress = req.user?.walletAddress || null;

    // Step 5: Save metadata in MongoDB
    const newCapsule = await Capsule.create({ 
      userId,
      title,
      description,
      category,
      unlockTimestamp: unlockUnix,
      heir,
      encryptedDataURI,
      txHash,
      fileHash,
      owner: walletAddress,
      confidence,
      verifiedAs: result,
      status: "verified",
      mimeType: file.mimetype,
      originalName: file.originalname,
    });

    await Log.create({
  event: "Capsule created",
  wallet: walletAddress,
  capsuleId: newCapsule._id
});


    // Return success response with metadata
    res.status(201).json({
      success: true,
      data: newCapsule,
      message: "Capsule created,verified and stored successfully.Mint it when ready,to preserve it permanently on-chain as an NFT.",
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Capsule creation failed." });
  }
};

// Mint a capsule into an NFT on-chain
exports.mintCapsule = async (req, res) => {
  try {
    const { id } = req.params;
    const walletAddress = req.user.walletAddress;

    // Log mint request and user wallet
    console.log("🔁 Mint request for capsule:", id);
    console.log("🔐 Wallet address:", walletAddress);

    const capsule = await Capsule.findById(id);
    if (!capsule) {
      console.log("❌ Capsule not found");
      return res.status(404).json({ success: false, message: "Capsule not found" });
    }

    // Prevent re-minting
    if (capsule.mintTxHash) {
      console.log("❌ Already minted");
      return res.status(400).json({ success: false, message: "Capsule already minted." });
    }

    // Ensure user has wallet connected
    if (!req.user.walletAddress) {
      console.log("❌ Wallet not connected");
      return res.status(400).json({
        success: false,
        message: "Wallet address required to mint capsule",
      });
    }

    // Prevent minting if already unlocked
    const now = Math.floor(Date.now() / 1000);
    if (capsule.unlockTimestamp <= now) {
      console.log("❌ Capsule already unlocked");
      return res.status(400).json({
        success: false,
        message: "Capsule is already unlocked. Cannot mint unlocked capsule.",
      });
    }

    // Call blockchain service to mint NFT
    const mintTxHash = await mintCapsuleOnChain({
      encryptedDataURI: capsule.encryptedDataURI,
      unlockTimestamp: capsule.unlockTimestamp,
      title: capsule.title,
      description: capsule.description,
      category: capsule.category,
      heir: capsule.heir,
      fileHash: capsule.fileHash,
    });

    // Save transaction hash to capsule
    capsule.mintTxHash = mintTxHash;
    await capsule.save();
    console.log("Minted NFT - tokenId:", mintTxHash);

    // Store minted NFT metadata in database
    await NFT.create({
      capsuleId: capsule._id,
      title: capsule.title,
      description: capsule.description,
      category: capsule.category,
      unlockTimestamp: capsule.unlockTimestamp,
      owner: walletAddress.toLowerCase(),
      mintTxHash,
      tokenId: mintTxHash, 
      fileHash: capsule.fileHash,
      encryptedDataURI: capsule.encryptedDataURI,
      mimeType: capsule.mimeType,
      originalName: capsule.originalName,
      isInherited: false,
      isTransferred: false,
      confirmed: false,
    });

    await Log.create({
  event: "Capsule minted",
  wallet: walletAddress,
  capsuleId: capsule._id
});


    // Return success response
    res.status(200).json({
      success: true,
      message: "Capsule minted as NFT successfully",
      mintTxHash,
    });
  } catch (err) {
    console.error("❌ Minting failed:", err);
    res.status(500).json({ success: false, message: "Minting failed" });
  }
};

// Unlock a capsule (download its content) after unlock time
exports.unlockCapsule = async (req, res) => {
  try {
    const { id } = req.params;
    const capsule = await Capsule.findById(id);

    if (!capsule) {
      return res.status(404).json({ success: false, message: "Capsule not found" });
    }

    // Ensure capsule has been confirmed on Arweave
    if (!capsule.confirmed) {
      return res.status(423).json({
        success: false,
        message: "Capsule is not yet confirmed on Arweave. Please wait until it’s permanently stored.",
      });
    }

    // Check if unlock time has been reached
    const currentTime = Math.floor(Date.now() / 1000); // current time in seconds
    if (currentTime < capsule.unlockTimestamp) {
      return res.status(403).json({
        success: false,
        message: "Capsule is still locked. Unlock date not reached.",
        unlockTimestamp: capsule.unlockTimestamp,
      });
    }

    let fileResponse;

    try {
      // Fetch encrypted file from Arweave
      fileResponse = await axios.get(capsule.encryptedDataURI, {
        responseType: "arraybuffer",
      });
    } catch (err) {
      console.error("⚠️ Arweave not ready:", capsule.encryptedDataURI);
      return res.status(502).json({
        success: false,
        message: "File is not yet available on Arweave. Please try again in a few moments.",
      });
    }

    // Decrypt the file content
    const decryptedBuffer = await decryptFile(fileResponse.data);

    // Send decrypted file to client as downloadable response
    res.set({
      "Content-Type": capsule.mimeType || "application/octet-stream",
      "Content-Disposition": `attachment; filename="${capsule.originalName || capsule.title.replace(/ /g, "_")}"`,
    });    

    console.log("📦 Sending file:", capsule.originalName);
    res.send(decryptedBuffer);

    await Log.create({
  event: "Capsule unlocked",
  wallet: req.user.walletAddress,
  capsuleId: capsule._id
});

  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Failed to unlock capsule" });
  }
};

// Get capsule metadata by ID
exports.getCapsuleById = async (req, res) => {
  try {
    const { id } = req.params;
     const userWallet = req.user?.walletAddress;

    const capsule = await Capsule.findById(id);

    if (!capsule) {
      return res.status(404).json({ success: false, message: "Capsule not found" });
    }
     //  Only current owner should be able to view it
    const isCurrentOwner = capsule.owner?.toLowerCase() === userWallet?.toLowerCase();
    
     if (!isCurrentOwner) {
      return res.status(403).json({ success: false, message: "Unauthorized: You no longer own this capsule" });
    }

   // Determine unlock status
    const now = Math.floor(Date.now() / 1000);
    const unlocked = now >= capsule.unlockTimestamp;

    // Determine mining/confirmation status
    let miningStatus = "Pending";
    if (capsule.confirmed) {
      miningStatus = "Confirmed";
    }

    
    // Generate file download URL if applicable
    let fileURL = null;
    if (unlocked && capsule.encryptedDataURI) {
      fileURL = capsule.encryptedDataURI;
    }

    // Return capsule metadata along with status flags
    res.status(200).json({
      success: true,
      data: {
        ...capsule.toObject(),
        unlocked,
        miningStatus,
        fileURL
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error fetching capsule" });
  }
};

// Delete a capsule if requester is the owner or creator
exports.deleteCapsule = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user?.userId;
    const userWallet = req.user?.walletAddress;

    const capsule = await Capsule.findById(id);

    if (!capsule) {
      return res.status(404).json({ success: false, message: "Capsule not found" });
    }

    // Authorization check
    const isCreator = capsule.userId?.toString() === userId;
    const isWalletOwner = capsule.owner === userWallet;

    if (!isCreator && !isWalletOwner) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized: You are not the capsule owner"
      });
    }

    // Delete capsule from DB
    await Capsule.findByIdAndDelete(id);

    await Log.create({
  event: "Capsule deleted",
  wallet: userWallet,
  capsuleId: capsule._id
});


    res.status(200).json({
      success: true,
      message: "Capsule metadata deleted successfully"
    });
  } catch (err) {
    console.error("❌ Capsule deletion failed:", err);
    res.status(500).json({
      success: false,
      message: "Server error deleting capsule"
    });
  }
};
