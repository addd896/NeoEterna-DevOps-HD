// controllers/authController.js
const { verifyMessage } = require("ethers");
const crypto = require("crypto"); // Used for generating random passwords
const jwt = require("jsonwebtoken");
const UserModel = require("../models/user");
const JWT_SECRET = process.env.JWT_SECRET;
const BlacklistedToken = require("../models/blacklistedToken");

// POST /api/auth/login
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate required fields
    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    // Check if user exists and include password for verification
    const user = await UserModel.findOne({ email }).select('+password');
    if (!user) {
      return res.status(400).json({ error: "Invalid email or password" });
    }

    // Compare provided password with stored hash
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ error: "Invalid email or password" });
    }

    // Generate and return JWT token
    const token = user.generateAuthToken();
    res.json({ token, user });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Login failed" });
  }
};

// POST /api/auth/register
exports.register = async (req, res) => {
  try {
    const { firstName, lastName, email, password, walletAddress } = req.body;

    // Validate required fields
    if (!email || !password || !firstName || !lastName) {
      return res.status(400).json({ error: "All fields are required" });
    }

    // Check if user already exists
    const existingUser = await UserModel.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: "User already exists" });
    }

    // Prepare user data
    const userData = {
      firstName,
      lastName,
      email,
      password,
    };
    
    // Add wallet address if provided
    if (walletAddress && typeof walletAddress === "string" && walletAddress.trim() !== "") {
      userData.walletAddress = walletAddress.trim();
    }
    
    // Create new user
    const user = await UserModel.create(userData);

    // Generate and return JWT token
    const token = user.generateAuthToken();
    res.json({ token, user });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Registration failed" });
  }
};

// GET /api/auth/me (protected route)
exports.getMe = async (req, res) => {
  try {
    // Fetch user by ID from decoded JWT
    const user = await UserModel.findById(req.user.userId);
    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch user" });
  }
};

// POST /api/auth/verifySignature
exports.verifySignature = async (req, res) => {
  const { message, signature, walletAddress } = req.body;

  // Validate required fields
  if (!message || !signature || !walletAddress) {
    return res.status(400).json({ error: "Missing fields in request" });
  }

  try {
    // Recover the signing address from the message and signature
    const recoveredAddress = await verifyMessage(message, signature);

    // Check if the recovered address matches the provided one
    if (recoveredAddress.toLowerCase() !== walletAddress.toLowerCase()) {
      return res.status(401).json({ error: "Signature verification failed" });
    }

    // Find existing user or create a new one
    let user = await UserModel.findOne({ walletAddress });
    if (!user) {
      user = await UserModel.create({
        firstName: "Web3",
        lastName: "User",
        email: `${walletAddress}@neoeterna.io`,
        password: crypto.randomBytes(32).toString("hex"),
        walletAddress
      });
    }

    // Generate and return JWT token
    const token = user.generateAuthToken();
    res.json({ token, user });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Signature verification error" });
  }
};

// POST /api/auth/logout
exports.logout = async (req, res) => {
  try {
    // Extract token from Authorization header
    const token = req.headers.authorization?.split(" ")[1];

    // Validate token presence
    if (!token) {
      return res.status(400).json({ error: "Token missing from Authorization header" });
    }

    // Add token to blacklist
    await BlacklistedToken.create({ token });

    res.json({ message: "User logged out successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Logout failed" });
  }
};
