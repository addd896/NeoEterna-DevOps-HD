const mongoose = require("mongoose");

// Schema for NFTs that represent blockchain-minted capsules
const nftSchema = new mongoose.Schema({
  // Reference to the original capsule that was minted
  capsuleId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Capsule",
    required: true
  },

  // Title of the capsule (copied from the original capsule)
  title: {
    type: String,
    required: true
  },

  // Description of the capsule's contents
  description: {
    type: String
  },

  // Category of the capsule (e.g., personal, legal, creative)
  category: {
    type: String
  },

  // UNIX timestamp of when the capsule can be unlocked
  unlockTimestamp: {
    type: Number
  },

  // Current owner's wallet address
  owner: {
    type: String,
    required: true
  },

  // Blockchain transaction hash from when the capsule was minted as an NFT
  mintTxHash: {
    type: String,
    required: true
  },

  // Unique token ID assigned to the NFT (used for retrieval and validation)
  tokenId: {
    type: String,
    required: true,
    unique: true
  },

  // File hash (used for verification or integrity checks)
  fileHash: {
    type: String
  },

  // URI to the encrypted file on Arweave (copied from the original capsule)
   encryptedDataURI: { 
    type: String 
  },
  
  // MIME type of the uploaded file (e.g., "image/png", "application/pdf")
  mimeType: { 
    type: String 
  },
  
  // Original filename uploaded by the user (used for download naming)
  originalName: {
    type: String
  },

  // Flag indicating whether the NFT has been inherited by another user
  isInherited: {
    type: Boolean,
    default: false
  },

  // Flag indicating if the NFT was transferred manually by the owner
  isTransferred: {
    type: Boolean,
    default: false
  },

  // Whether the NFT’s related capsule has been confirmed as mined on Arweave
  confirmed: {
    type: Boolean,
    default: false
  },

},
{
  // Automatically include createdAt and updatedAt timestamps
  timestamps: true
});

// Export the model to be used for querying and managing NFT records
module.exports = mongoose.model("NFT", nftSchema);
