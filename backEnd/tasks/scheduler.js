// task/scheduler.js

const cron = require("node-cron");
const axios = require("axios");
const Capsule = require("../models/capsule");
const NOTIFICATION_TYPES = require("../utils/notificationTypes");
const { generateNotificationMessage } = require("../utils/notificationMessages");

/**
 * Sends a notification to the user via the webhook route
 * @param {string} userId - ID of the user to notify
 * @param {string} type - Type of notification
 * @param {Object} context - Optional data for generating message (e.g., capsule)
 */
async function sendNotification(userId, type, context = {}) {
  try {
        // Ensure the `type` is a valid enum value from `NOTIFICATION_TYPES`
        const validTypes = Object.values(NOTIFICATION_TYPES);
        if (!validTypes.includes(type)) {
          console.warn(`⚠️ Invalid notification type: ${type}`);
          return;
        }
    
        // Generate message based on type and context (e.g., capsule)
        const message = generateNotificationMessage(type, context);
    
        // Send the notification via the webhook route
    await axios.post("http://localhost:5000/api/notifications/webhook", {
      userId,
      type,
      message,
    });
    console.log(`📨 Notification sent to user ${userId}`);
  } catch (err) {
    console.warn(`Failed to notify user ${userId}:`, err.message);
  }
}
/**
 * Starts a cron job that:
 * - Unlocks capsules based on unlockTimestamp
 * - Checks Arweave mining status for uploaded capsules
 */
function startScheduler() {
  // Runs every 3 minutes (*/3 * * * *)
  cron.schedule("*/3 * * * *", async () => {
    try {
      const now = Math.floor(Date.now() / 1000);
      console.log(`⏱️ Scheduler ran at ${new Date().toISOString()}`);

      // STEP 1: Find capsules whose unlockTimestamp has passed
      const unlockableCapsules = await Capsule.find({
        unlockTimestamp: { $lte: now },
        status: 'verified'
      });

      console.log(`🔍 Found ${unlockableCapsules.length} capsules ready to unlock.`);

      // Unlock and notify for each eligible capsule
      for (const capsule of unlockableCapsules) {
        if (capsule.status !== "unlocked") {
          capsule.status = "unlocked";
          await capsule.save();
          console.log(`🔓 Capsule ${capsule._id} is now unlocked.`);

          await sendNotification(
            capsule.userId,
            `🎉 Your capsule "${capsule.title}" is now unlocked!`,
            NOTIFICATION_TYPES.CAPSULE_UNLOCK
          );
        }
      }

      // STEP 2: Verify storage confirmation on Arweave
      const unconfirmedCapsules = await Capsule.find({
        confirmed: false,
        txHash: { $exists: true }
      });

      console.log(`🔍 Found ${unconfirmedCapsules.length} unconfirmed capsules.`);

      for (const capsule of unconfirmedCapsules) {
        try {
          let bundleTxId = capsule.bundleTxId;

          // Fetch bundleTxId from Bundlr if it's not already stored
          if (!bundleTxId) {
            const bundlrUrl = `https://node1.bundlr.network/tx/${capsule.txHash}/status`;
            const { data } = await axios.get(bundlrUrl);
            bundleTxId = data?.bundleTxId;

            if (bundleTxId) {
              capsule.bundleTxId = bundleTxId;
              await capsule.save();
              console.log(`📦 Saved bundleTxId for ${capsule._id}`);
            } else {
              console.log(`⏳ Waiting on Bundlr for capsule ${capsule._id}`);
              continue; // Skip to next capsule
            }
          }

          // Check Arweave mining status
          const arweaveStatusUrl = `https://arweave.net/tx/${bundleTxId}/status`;
          console.log(`⛓ Checking Arweave status: ${arweaveStatusUrl}`);
          const { data: arweaveStatus } = await axios.get(arweaveStatusUrl);

          if (arweaveStatus?.number_of_confirmations >= 1) {
            capsule.confirmed = true;
            await capsule.save();
            console.log(`✅ Capsule ${capsule._id} is now mined on Arweave.`);

            // Notify user upon successful mining
            await sendNotification(
              capsule.userId,
              `Your capsule "${capsule.title}" has been mined and permanently stored on Arweave.`,
              NOTIFICATION_TYPES.STORAGE_CONFIRMED
            );
          } else {
            console.log(`⏳ Capsule ${capsule._id} is still pending mining.`);
          }
        } catch (err) {
          console.warn(`⚠️ Could not verify capsule ${capsule._id}: ${err.message}`);
        }
      }
    } catch (error) {
      console.error("Scheduler error:", error.message);
    }
  });

  console.log("🕒 Capsule scheduler started.");
}

module.exports = startScheduler;
