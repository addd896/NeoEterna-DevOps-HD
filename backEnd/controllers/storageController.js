const Capsule = require("../models/capsule");
const storage = require('../models/storage');
const { uploadToBundlr } = require("../services/bundlrService");
const { encryptFile, decryptFile } = require("../utils/encryption");
const axios = require("axios");
const https = require("https");

// Check Arweave storage status for a specific capsule
const getStorageStatus = async (req, res) => {
  try {
    const { id } = req.params;

    // Find capsule by ID and ensure it has an encrypted file URI
    const capsule = await Capsule.findById(id);
    if (!capsule || !capsule.encryptedDataURI) {
      return res.status(404).json({ error: "Capsule not found or no file URI" });
    }

    const uri = capsule.encryptedDataURI;

    try {
      // Use HEAD request to check file availability on Arweave
      const response = await axios.head(uri);
      const contentLength = response.headers['content-length'];

      return res.status(200).json({
        success: true,
        uri,
        status: "Available", // Notify frontend that file is accessible
        size: contentLength ? `${(contentLength / 1024).toFixed(2)} KB` : "Unknown",
      });
    } catch (err) {
      // If file isn't found, return 'Pending' status
      if (err.response && err.response.status === 404) {
        return res.status(202).json({
          success: false,
          uri,
          status: "Pending",
          message: "File not yet propagated to Arweave. Try again in a few minutes."
        });
      }
      throw err;
    }
  } catch (err) {
    console.error("Storage status check error:", err.message);
    return res.status(500).json({ error: "Failed to check storage status" });
  }
};

// Upload and encrypt file, then store it via Bundlr/Arweave
const uploadEncryptedFile = async (req, res) => {
  try {
    const file = req.file;

    // Check for uploaded file
    if (!file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    // Encrypt the uploaded file before storing
    const encryptedBuffer = await encryptFile(file.buffer);

    // Upload encrypted file to Bundlr and receive URI and txHash
    const { uri: fileURI, txHash } = await uploadToBundlr(encryptedBuffer);

    // Handle unlock timestamp: convert to Unix seconds or default to now
    let unlockTimestamp = req.body.unlockTimestamp;
    if (unlockTimestamp) {
      unlockTimestamp = Math.floor(new Date(unlockTimestamp).getTime() / 1000);
      if (isNaN(unlockTimestamp)) throw new Error("Invalid unlockTimestamp format");
    } else {
      unlockTimestamp = Math.floor(Date.now() / 1000); // Default: current time
    }

    const title = req.body.title || "Untitled Capsule";
    const owner = req.user.walletAddress;

    // Save capsule metadata in MongoDB
    const capsule = await Capsule.create({
      encryptedDataURI: fileURI,
      owner,
      unlockTimestamp,
      title,
      txHash,
    });

    return res.status(200).json({
      success: true,
      capsule,
      message: "File uploaded and stored permanently on Arweave via Bundlr."
    });

  } catch (err) {
    console.error("File upload failed:", err);
    res.status(500).json({ error: "File upload failed" });
  }
};

// Download and decrypt capsule after unlock timestamp and permission check
const downloadDecryptedCapsule = async (req, res) => {
  try {
    const { id } = req.params;
    const userWallet = req.user.walletAddress;

    // Find capsule and check existence
    const capsule = await Capsule.findById(id);
    if (!capsule) {
      return res.status(404).json({ error: "Capsule not found" });
    }

    // Ensure requesting user is the heir
    if (capsule.heir.toLowerCase() !== userWallet.toLowerCase()) {
      return res.status(403).json({ error: "Not authorized to access this capsule." });
    }

    // Verify time-lock has passed
    const now = Math.floor(Date.now() / 1000);
    if (now < capsule.unlockTimestamp) {
      return res.status(403).json({ error: "Capsule is time-locked." });
    }

    const fileUrl = capsule.encryptedDataURI;

    // Download encrypted file using HTTPS
    https.get(fileUrl, (fileRes) => {
      const chunks = [];

      fileRes.on("data", (chunk) => chunks.push(chunk));
      fileRes.on("end", () => {
        // Decrypt the file once download completes
        const encryptedBuffer = Buffer.concat(chunks);
        const decryptedBuffer = decryptFile(encryptedBuffer);

        // Set headers and send decrypted file to client
        res.set({
          "Content-Type": "application/octet-stream",
          "Content-Disposition": `attachment; filename="capsule_${id}.bin"`,
        });

        res.send(decryptedBuffer);
      });
    }).on("error", (err) => {
      console.error("Download error:", err.message);
      res.status(500).json({ error: "Failed to fetch capsule data." });
    });

  } catch (err) {
    console.error("Decryption download error:", err.message);
    res.status(500).json({ error: "Decryption failed" });
  }
};

// List all capsules uploaded by the current user's wallet
const listUserCapsules = async (req, res) => {
  try {
    const userWallet = req.user.walletAddress;

    // Fetch capsules where owner matches the logged-in wallet
    const capsules = await Capsule.find({ owner: userWallet });
    res.status(200).json({ success: true, capsules });
  } catch (err) {
    console.error("Capsule retrieval error:", err.message);
    res.status(500).json({ error: "Failed to retrieve capsules" });
  }
};

// Placeholder for future pinning to a secondary backup service
const pinFileToBackup = (req, res) => {
  return res.status(501).json({ message: "Backup pinning not implemented yet." });
};

// GET /api/storage/flagged
const getFlaggedCapsules = async (req, res) => {
  try {
    const flagged = await Capsule.find({ flagged: true }).sort({ createdAt: -1 });
    res.json(flagged);
  } catch (err) {
    console.error("Error fetching flagged capsules:", err);
    res.status(500).json({ error: "Failed to fetch flagged capsules" });
  }
};

module.exports = {
  uploadEncryptedFile,
  downloadDecryptedCapsule,
  listUserCapsules,
  getStorageStatus,
  pinFileToBackup,
  getFlaggedCapsules,
};
