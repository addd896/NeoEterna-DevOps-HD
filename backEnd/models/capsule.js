const mongoose = require('mongoose');

// Define schema for time-locked digital capsules
const capsuleSchema = new mongoose.Schema(
  {
    // Reference to the user who created the capsule (linked to User collection)
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },

    // Wallet address of the user who owns the capsule
    owner: { type: String },

    // Title of the capsule (required for identification/display)
    title: { type: String, required: true },

    // Description provided by the user about the capsule's contents
    description: { type: String, required: true },

    // Category of content (e.g., personal, legal, academic)
    category: { type: String, required: true },

    // URI pointing to the encrypted data on Arweave
    encryptedDataURI: { type: String, required: true },

    // When the capsule can be unlocked (UNIX timestamp in seconds)
    unlockTimestamp: { type: Number, required: true },

    // Wallet address of the heir (recipient who will unlock the capsule)
    heir: { type: String, required: true },

    // Transaction hash from Arweave for permanent file storage
    txHash: { type: String },

    // Blockchain transaction hash when the capsule is minted as NFT
    mintTxHash: { type: String },

    // Hash of the file (used for verification, integrity check)
    fileHash: { type: String },

    // Whether the capsule has been confirmed as stored on Arweave
    confirmed: { type: Boolean, default: false },

    // Status of the capsule within the system
    // verified: after AI verification
    // minted: after NFT minting
    // unlocked: after unlock date has passed and file is accessed
    // deleted: soft deletion
    status: {
      type: String,
      enum: ["verified", "minted", "unlocked", "deleted"],
      default: "verified",
    },

    // Confidence score from AI verification model (0–1)
    confidence: { type: Number },

    // AI classification result: "authentic" or "forged"
    verifiedAs: { type: String },

    // MIME type of the original file (e.g., image/jpeg)
    mimeType: { type: String },

    // Original name of the uploaded file
    originalName: { type: String },
  },
  {
    // Automatically adds createdAt and updatedAt timestamps
    timestamps: true
  }
);

// Export the Capsule model to be used in route handlers, controllers, and services
module.exports = mongoose.model("Capsule", capsuleSchema);
