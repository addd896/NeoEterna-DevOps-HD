const express = require("express");
const router = express.Router();
const multer = require("multer");

// Configure Multer to use memory storage for handling file uploads
const storage = multer.memoryStorage(); // Store uploaded files in memory
const upload = multer({ storage });

const capsuleController = require("../controllers/capsuleController");
const { requireAuth } = require("../middleware/authMiddleware");

// POST /api/capsules/create
// Route to create a new capsule
// - Requires authentication
// - Accepts a single file upload
router.post(
  "/create",
  requireAuth,                // Verify JWT token
  upload.single("file"),      // Accept single file from multipart/form-data
  capsuleController.createCapsule // Controller to handle creation logic
);

// GET /api/capsules/:id
// Retrieve a capsule's metadata by ID
// - Requires authentication
router.get(
  "/:id", 
  requireAuth, 
  capsuleController.getCapsuleById
);

// GET /api/capsules/unlock/:id
// Attempt to unlock and download capsule content if time-locked conditions are met
// - Requires authentication
router.get(
  "/unlock/:id", 
  requireAuth, 
  capsuleController.unlockCapsule
);

// POST /api/capsules/mint/:id
// Mint the capsule as an NFT
// - Requires authentication and wallet connection
router.post(
  "/mint/:id", 
  requireAuth, 
  capsuleController.mintCapsule
);

// DELETE /api/capsules/:id
// Delete the capsule (if user is owner or creator)
// - Requires authentication
router.delete(
  "/:id", 
  requireAuth, 
  capsuleController.deleteCapsule
);

// Export the router for integration into the main app
module.exports = router;
