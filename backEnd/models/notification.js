const mongoose = require('mongoose');

// Schema for storing user notifications triggered by system events
const notificationSchema = new mongoose.Schema({
  // Reference to the user receiving the notification
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },

  // Type of notification (must match one of the predefined categories)
  type: {
    type: String,
    enum: [
      // 📦 Capsule lifecycle events
      "capsule_created",       // Capsule successfully created
      "capsule_minted",        // Capsule minted as NFT
      "capsule_failed",        // Capsule creation/storage/verification failed
      "capsule_unlock",        // Capsule reached unlock timestamp
      "capsule_deleted",       // Capsule was deleted
      "capsule_downloaded",    // Capsule downloaded by heir or owner

      // 🔍 AI-related events
      "capsule_verified",      // Capsule verified as authentic
      "capsule_forged",        // Capsule flagged as forged by AI
      "access_denied",         // Unauthorized attempt to access a capsule

      // 💎 NFT-related events
      "nft_transferred",       // NFT manually transferred to another wallet
      "nft_received",          // New NFT received in user's wallet
      "nft_inherited",         // NFT inherited through a smart contract or system action

      // 📡 Arweave storage events
      "storage_pending",       // File upload initiated, waiting for confirmation
      "storage_confirmed",     // File has been successfully mined and stored on Arweave
      "storage_failed",        // File storage failed (timeout, rejection, etc.)

      // ⚙️ System settings and user profile events
      "profile_updated",       // User updated profile settings
      "notifications_on",      // User turned notifications on
      "notifications_off"      // User turned notifications off
    ],
    required: true // Type is mandatory for classification
  },

  // Human-readable message for display in the UI
  message: {
    type: String,
    required: true
  },

  // Read/unread status for tracking notification consumption
  read: {
    type: Boolean,
    default: false // Default to unread when created
  }
}, {
  // Automatically add createdAt and updatedAt fields
  timestamps: true
});

// Export the Notification model to be used in notification services/controllers
module.exports = mongoose.model('Notification', notificationSchema);
