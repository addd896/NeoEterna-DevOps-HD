const express = require("express");
const router = express.Router();
const multer = require("multer");

// Configure Multer to store uploaded files on disk (in /uploads directory)
const upload = multer({ dest: "uploads/" });

const { verifyFile } = require("../controllers/verificationController");

// POST /api/verify
// Accepts a single file upload and sends it to the FastAPI service for verification
// - File must be sent using multipart/form-data under the field name "file"
// - Controller will handle AI verification and log results to MongoDB
router.post("/", upload.single("file"), verifyFile);

// Export the router to be mounted in the main Express app
module.exports = router;
