const Notification = require('../models/notification');
const User = require('../models/user');
const { NOTIFICATION_TYPES } = require('../utils/notificationTypes'); // Includes types like: capsule_created, storage_confirmed, capsule_unlock, capsule_minted, etc.

// Handle incoming webhook-based notifications (e.g., from internal services)
exports.handleWebhook = async (req, res) => {
  try {
    const { userId, type, message } = req.body;

    // Validate required fields
    if (!userId || !type || !message) {
      return res.status(400).json({ error: "Missing fields in notification." });
    }

    // Create new notification entry in DB
    await Notification.create({ userId, type, message });
    res.status(200).json({ success: true });
  } catch (err) {
    console.error("❌ Webhook failed:", err.message);
    res.status(500).json({ error: 'Webhook failed' });
  }
};

// Fetch all notifications for the logged-in user
exports.getUserNotifications = async (req, res) => {
  try {
    const userId = req.user.userId;  // Authenticated user's ID from middleware

    // Fetch and sort notifications in reverse chronological order
    const notifications = await Notification.find({ userId }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: notifications.length,
      notifications
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch notifications' });
  }
};

// Allow user to update notification preferences (e.g., enable/disable types)
exports.updatePreferences = async (req, res) => {
  try {
    const userId = req.user.userId; 
    const { preferences } = req.body;

    // Store updated preferences (could include toggles for capsule_minted, unlocked, inherited, etc.)
    await User.findByIdAndUpdate(userId, { notificationPreferences: preferences });
    res.status(200).json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update preferences' });
  }
};

// Mark a specific notification as read
exports.markAsRead = async (req, res) => {
  try {
    const { id } = req.params;

    // Update 'read' status to true for a single notification
    const notification = await Notification.findByIdAndUpdate(id, { read: true }, { new: true });
    res.status(200).json(notification);
  } catch (err) {
    res.status(500).json({ error: 'Failed to mark notification as read' });
  }
};

// Clear all notifications for the user (e.g., on dashboard cleanup)
exports.clearAllNotifications = async (req, res) => {
  try {
    const userId = req.user.userId; 

    // Delete all user notifications
    await Notification.deleteMany({ userId });
    res.status(200).json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Failed to clear notifications' });
  }
};
