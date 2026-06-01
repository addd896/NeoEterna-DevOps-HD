const express = require("express");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const morgan = require("morgan");
const multer = require("multer");
const cors = require("cors");
const path = require("path");

// Load env variables
dotenv.config();

// App
const app = express();

// Middleware
app.use(cors({
  origin: 'http://localhost:5173', // frontend URL
  credentials: true,               // allow cookies / sessions
  exposedHeaders: ["Content-Disposition"],
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));

// Multer config for file uploads
const storage = multer.memoryStorage(); // Store files in memory for encryption
const upload = multer({ storage });

// MongoDB Connection
if (process.env.NODE_ENV !== "test") {
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})

.then(() => console.log("✅ MongoDB connected"))
.catch((err) => console.error("❌ MongoDB connection error:", err));
}
// Import routes
const capsuleRoutes = require("./routes/capsuleRoutes");
const storageRoutes = require("./routes/storageRoutes");
const verificationRoutes = require("./routes/verificationRoutes");
const authRoutes = require("./routes/authRoutes");
const userRoutes= require("./routes/userRoutes");
const nftRoutes = require('./routes/nftRoutes');
const adminRoutes = require('./routes/adminRoutes');
const notificationRoutes = require('./routes/notificationRoutes');
// Routes
app.use("/api/capsules",  capsuleRoutes);
app.use("/api/storage",  storageRoutes);
app.use("/api/verify", verificationRoutes); 
app.use("/api/auth", authRoutes); 
app.use("/api/user", userRoutes);
app.use('/api/nft', nftRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/notifications', notificationRoutes);

// Test route
app.get("/api/health", (req, res) => {
  res.send("🌐 NeoEterna Backend is Live");
});

// Start unlock scheduler
if (process.env.NODE_ENV !== "test") {
const startScheduler = require('./tasks/scheduler');
startScheduler();
}
// Start server
const PORT = process.env.PORT || 5000;

if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`🚀 Backend running on http://localhost:${PORT}`);
  });
}

module.exports = app;

