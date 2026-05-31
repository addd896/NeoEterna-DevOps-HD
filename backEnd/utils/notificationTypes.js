// Centralized enumeration of all system-wide notification types
// Used to maintain consistency in notification creation and handling across services

const NOTIFICATION_TYPES = {
    // 📦 Capsule Lifecycle Notifications
    CAPSULE_CREATED: "capsule_created",         // Triggered when a new capsule is created
    CAPSULE_MINTED: "capsule_minted",           // Triggered after a capsule is successfully minted as NFT
    CAPSULE_FAILED: "capsule_failed",           // Triggered when capsule creation or storage fails
    CAPSULE_UNLOCK: "capsule_unlock",           // Triggered when the capsule reaches its unlock timestamp
    CAPSULE_DELETED: "capsule_deleted",         // Triggered when a capsule is deleted by the user
    CAPSULE_DOWNLOADED: "capsule_downloaded",   // Triggered when a capsule is successfully downloaded
  
    // 🔍 AI Verification Results
    CAPSULE_VERIFIED: "capsule_verified",       // Triggered when AI marks the file as authentic
    CAPSULE_FORGED: "capsule_forged",           // Triggered when AI detects forgery or tampering
    ACCESS_DENIED: "access_denied",             // Triggered when unauthorized access is attempted
  
    // 💎 NFT Events
    NFT_TRANSFERRED: "nft_transferred",         // Triggered when an NFT is transferred to another wallet
    NFT_RECEIVED: "nft_received",               // Triggered when the user receives an NFT
    NFT_INHERITED: "nft_inherited",             // Triggered when an NFT is inherited by a designated heir
  
    // 📡 Arweave/Bundlr Storage Events
    STORAGE_PENDING: "storage_pending",         // File uploaded but not yet mined
    STORAGE_CONFIRMED: "storage_confirmed",     // File has been mined and confirmed on Arweave
    STORAGE_FAILED: "storage_failed",           // File failed to upload or confirm on-chain
  
    // ⚙️ System-Level / User Profile Events
    PROFILE_UPDATED: "profile_updated",         // Triggered when user updates profile settings
    NOTIFICATIONS_ON: "notifications_on",       // Triggered when user enables notifications
    NOTIFICATIONS_OFF: "notifications_off"      // Triggered when user disables notifications
  };
  
  // Export the constant for use in controllers, schedulers, and services
  module.exports = NOTIFICATION_TYPES;
  