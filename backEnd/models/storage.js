const mongoose = require("mongoose");

// Schema for tracking uploaded files stored via Bundlr/Arweave
const storageSchema = new mongoose.Schema({
  // Permanent URI of the uploaded file on Arweave (via Bundlr)
  uri: {
    type: String,
    required: true // Required to locate the file
  },

  // Wallet address or identifier of the uploader (optional for tracking)
  uploader: {
    type: String
  },

  // Reference to the associated capsule (if the file is part of one)
  capsuleId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Capsule'
  },

  // Size of the uploaded file in bytes (optional)
  size: {
    type: Number
  },

  // Indicates whether the uploaded file was encrypted before storage
  encrypted: {
    type: Boolean
  },

  // Timestamp indicating when the file was uploaded
  uploadedAt: {
    type: Date,
    default: Date.now // Automatically set to current time when created
  }
});

// Export the model to be used for storage tracking and file status monitoring
module.exports = mongoose.model("Storage", storageSchema);
