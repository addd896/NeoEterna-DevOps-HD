// routes/authRoutes.js

const express = require("express");

const {
  login,
  register,
  getMe,
  verifySignature,
  logout
} = require("../controllers/authController");

const { requireAuth } = require("../middleware/authMiddleware");

const router = express.Router();

// POST /api/auth/login
// Logs a user in using email/password credentials
router.post('/login', login);

// POST /api/auth/register
// Registers a new user account with email and password
router.post('/register', register);

// GET /api/auth/me
// Returns the authenticated user's profile (requires a valid JWT token)
router.get('/me', requireAuth, getMe);

// POST /api/auth/verify-signature
// Supports Web3 authentication (e.g., MetaMask) by verifying signed wallet messages
router.post('/verify-signature', verifySignature);

// POST /api/auth/logout
// Logs the user out by blacklisting the JWT token (requires auth)
router.post('/logout', requireAuth, logout);

// Export router to be used in the main Express app
module.exports = router;
