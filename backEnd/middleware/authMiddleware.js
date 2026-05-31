// middleware/authMiddleware.js
require("dotenv").config();

const jwt = require("jsonwebtoken");
const JWT_SECRET = process.env.JWT_SECRET; // JWT secret key stored in environment variables
const BlacklistedToken = require("../models/blacklistedToken"); // MongoDB model for storing invalidated tokens

// Middleware to protect routes by requiring a valid JWT token
async function requireAuth(req, res, next) {
  // Extract token from the Authorization header (format: Bearer <token>)
  const token = req.headers.authorization?.split(" ")[1];
   if (!token) return res.status(401).json({ error: "Unauthorized" });

  try {
    // Check if the token is blacklisted (e.g., from logout)
    const isBlacklisted = await BlacklistedToken.findOne({ token });
    if (isBlacklisted) {
      return res.status(401).json({ error: "Session expired. Please login again." });
    }

    // Verify and decode the JWT token using the secret
    const decoded = jwt.verify(token, JWT_SECRET);
    // Attach decoded user information to the request object for downstream use
    req.user = {
      userId: decoded.userId,         // Unique ID of the authenticated user
      walletAddress: decoded.walletAddress, // Web3 wallet (if used)
      role: decoded.role,             // Role (e.g., user or admin)
    };

    // Pass control to the next middleware or route handler
    next();
  } catch (err) {
    // Handle invalid, expired, or malformed token
    res.status(401).json({ error: "Invalid token" });
  }
}

// Middleware to restrict access to admin-only routes
function requireAdmin(req, res, next) {
  // Ensure user is authenticated and has admin privileges
  if (!req.user || req.user.role !== "admin") {
    return res.status(403).json({ error: "Admin access required" });
  }

  // If user is admin, continue to the next handler
  next();
}

// Export both middleware functions for use in protected routes
module.exports = {
  requireAuth,
  requireAdmin
};
