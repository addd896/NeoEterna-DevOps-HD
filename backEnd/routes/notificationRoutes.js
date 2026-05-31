const express = require('express');
const router = express.Router();
const { requireAuth } = require('../middleware/authMiddleware');
const notificationController = require('../controllers/notificationController');

// POST /api/notifications/webhook
// Endpoint for receiving notification events from external/internal services
// Accepts payload with userId, type, and message
router.post('/webhook', notificationController.handleWebhook);

// GET /api/notifications/user
// Fetch all notifications for the authenticated user
// Requires JWT authentication
router.get('/user', requireAuth, notificationController.getUserNotifications);

// PATCH /api/notifications/preferences
// Update the user's notification preferences (e.g., types they want to receive)
// Requires JWT authentication
router.patch('/preferences', requireAuth, notificationController.updatePreferences);

// PATCH /api/notifications/:id/read
// Mark a specific notification as read
// Requires JWT authentication
router.patch('/:id/read', requireAuth, notificationController.markAsRead);

// DELETE /api/notifications/all
// Clear all notifications for the logged-in user
// Requires JWT authentication
router.delete('/all', requireAuth, notificationController.clearAllNotifications);

// Export the router to be used in the main application
module.exports = router;
