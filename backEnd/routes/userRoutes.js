// routes/userRoutes.js
const express = require("express");
const userController = require("../controllers/userController");
const { requireAuth , requireAdmin } = require("../middleware/authMiddleware");

const router = express.Router();

// GET /api/users/profile
// Fetch the authenticated user's profile data
// - Requires a valid JWT token
// - Returns user object excluding password
router.get("/profile", requireAuth, userController.getProfile);

// PATCH /api/users/settings
// Update account settings (e.g., name, password, preferences)
// - Requires authentication
// - Accepts partial updates in request body
router.patch("/settings", requireAuth, userController.updateSettings);

router.put('/password', requireAuth, userController.updatePassword);

router.delete('/delete', requireAuth, userController.deleteAccount);

// Admin-only
router.get("/all", requireAuth, requireAdmin, userController.getAllUsers);

// Export the configured router to be used in the main Express app
module.exports = router;
