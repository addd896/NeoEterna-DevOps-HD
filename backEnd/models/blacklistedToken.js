// models/BlacklistedToken.js

const mongoose = require("mongoose");

// Schema to store JWT tokens that have been invalidated (e.g., after logout)
const blacklistedTokenSchema = new mongoose.Schema({
  // The JWT token string that has been blacklisted
  token: {
    type: String,
    required: true // Token is required to identify the invalid session
  },

  // Timestamp when the token was added to the blacklist
  blacklistedAt: {
    type: Date,
    default: Date.now // Automatically set to current time when created
  }
});

// Exportinf the model for use in middleware (e.g., to block reuse of logged-out tokens)
module.exports = mongoose.model("BlacklistedToken", blacklistedTokenSchema);
