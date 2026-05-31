// utils/notificationMessages.js

const NOTIFICATION_TYPES = require('./notificationTypes');

const notificationMessages = {
  [NOTIFICATION_TYPES.CAPSULE_CREATED]: (capsule) =>
    `Your capsule "${capsule.title}" was created successfully.`,

  [NOTIFICATION_TYPES.CAPSULE_MINTED]: (capsule) =>
    `Your capsule "${capsule.title}" has been minted as an NFT.`,

  [NOTIFICATION_TYPES.CAPSULE_FAILED]: (capsule) =>
    `Something went wrong while processing "${capsule.title}". Please try again.`,

  [NOTIFICATION_TYPES.CAPSULE_UNLOCK]: (capsule) =>
    `🎉 Your capsule "${capsule.title}" is now unlocked and ready to download.`,

  [NOTIFICATION_TYPES.CAPSULE_DELETED]: (capsule) =>
    `Capsule "${capsule.title}" has been deleted.`,

  [NOTIFICATION_TYPES.CAPSULE_DOWNLOADED]: (capsule) =>
    `Your capsule "${capsule.title}" has been downloaded.`,

  [NOTIFICATION_TYPES.CAPSULE_VERIFIED]: (capsule) =>
    `The file "${capsule.title}" has been verified as authentic.`,

  [NOTIFICATION_TYPES.CAPSULE_FORGED]: (capsule) =>
    `⚠️ The file "${capsule.title}" may be forged or manipulated.`,

  [NOTIFICATION_TYPES.ACCESS_DENIED]: () =>
    `You attempted to access a capsule that you do not own.`,

  [NOTIFICATION_TYPES.NFT_TRANSFERRED]: (capsule) =>
    `You transferred the NFT for capsule "${capsule.title}".`,

  [NOTIFICATION_TYPES.NFT_RECEIVED]: (capsule) =>
    `You received an NFT linked to capsule "${capsule.title}".`,

  [NOTIFICATION_TYPES.NFT_INHERITED]: (capsule) =>
    `You have inherited the NFT for capsule "${capsule.title}".`,

  [NOTIFICATION_TYPES.STORAGE_PENDING]: (capsule) =>
    `Upload for "${capsule.title}" has started and is awaiting confirmation.`,

  [NOTIFICATION_TYPES.STORAGE_CONFIRMED]: (capsule) =>
    `Your capsule "${capsule.title}" has been mined and permanently stored on Arweave.`,

  [NOTIFICATION_TYPES.STORAGE_FAILED]: (capsule) =>
    `Upload for capsule "${capsule.title}" failed to complete.`,

  [NOTIFICATION_TYPES.PROFILE_UPDATED]: () =>
    `Your profile settings have been updated.`,

  [NOTIFICATION_TYPES.NOTIFICATIONS_ON]: () =>
    `You have turned notifications ON.`,

  [NOTIFICATION_TYPES.NOTIFICATIONS_OFF]: () =>
    `You have turned notifications OFF.`,
};

/**
 * Generates a message based on type and dynamic data
 * @param {string} type - Notification type
 * @param {Object} context - Additional data (e.g., capsule)
 * @returns {string} - Formatted notification message
 */
function generateNotificationMessage(type, context = {}) {
  const generator = notificationMessages[type];
  return generator ? generator(context) : "You have a new notification.";
}

module.exports = {
  generateNotificationMessage,
};
