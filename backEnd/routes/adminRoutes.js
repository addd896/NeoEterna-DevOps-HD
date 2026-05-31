// routes/adminRoutes.js

const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { requireAuth, requireAdmin } = require('../middleware/authMiddleware');

// These routes are protected by two layers of middleware:
// 1. requireAuth - verifies JWT token and sets req.user
// 2. requireAdmin - checks if req.user.role is 'admin'

// GET /api/admin/audit
// Retrieve system audit logs (e.g., user actions, uploads, etc.)
router.get('/audit', requireAuth, requireAdmin, adminController.getAuditLogs);

// POST /api/admin/flag
// Flag a capsule for moderation or review
router.post('/flag', requireAuth, requireAdmin, adminController.flagContent);

// POST /api/admin/ban
// Ban a user by wallet address
router.post('/ban', requireAuth, requireAdmin, adminController.banUser);

// GET /api/admin/stats
// Get platform-wide statistics (e.g., total users, capsules)
router.get('/stats', requireAuth, requireAdmin, adminController.getAdminStats);

// Export the router to be used in the main Express app
module.exports = router;
