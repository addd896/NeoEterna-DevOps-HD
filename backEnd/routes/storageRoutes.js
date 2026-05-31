const express = require("express");
const router = express.Router();
const multer = require("multer");

// Configure Multer to store uploaded files in memory
const storage = multer.memoryStorage();
const upload = multer({ storage });

const storageController = require("../controllers/storageController");
const { requireAuth, requireAdmin } = require("../middleware/authMiddleware"); // ✅ Authentication middleware

// GET /api/storage/retrieve/:id
// Download and decrypt capsule content by ID
// - Requires the user to be authenticated
// - Heir must match, and unlock time must be passed
router.get("/retrieve/:id", requireAuth, storageController.downloadDecryptedCapsule);

// GET /api/storage/user/capsules
// List all capsules that belong to the authenticated user's wallet
// - Requires authentication
router.get("/user/capsules", requireAuth, storageController.listUserCapsules); 

// POST /api/storage/upload
// Upload a new capsule file to Bundlr/Arweave
// - Requires authentication
// - File is uploaded as multipart/form-data under field name "file"
router.post("/upload", requireAuth, upload.single("file"), storageController.uploadEncryptedFile);

// GET /api/storage/status/:id
// Check Arweave/Bundlr propagation status for a given capsule
// - Useful to confirm when the file is mined and accessible
router.get("/status/:id", requireAuth, storageController.getStorageStatus);

// POST /api/storage/pin
// Pin file to an external backup service (e.g., Filecoin/IPFS) [Not implemented yet]
// - Requires authentication
router.post("/pin", requireAuth, storageController.pinFileToBackup);

router.get("/flagged", requireAuth, requireAdmin, storageController.getFlaggedCapsules);

// Export router to integrate with the main Express app
module.exports = router;
