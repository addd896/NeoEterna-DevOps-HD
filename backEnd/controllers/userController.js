const User = require('../models/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Capsule = require('../models/capsule');
const NFT = require('../models/nft');

// GET logged-in user's profile
exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });

    
    const capsules = await Capsule.find({ userId: user._id });
    const nfts = await NFT.find({ owner: user.walletAddress.toLowerCase() });

    res.status(200).json({ success: true, 
       user: {
        ...user.toObject(),
        capsules,
        nfts,
      },
     });
  } catch (error) {
    console.error('❌ Error fetching profile:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// UPDATE password securely
exports.updatePassword = async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;

    if (!oldPassword || !newPassword)
      return res.status(400).json({ message: 'Old and new password required' });

    const user = await User.findById(req.user.userId).select('+password');
    if (!user) return res.status(404).json({ message: 'User not found' });

    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Old password is incorrect' });
    }

    // Hash and update
    user.password = newPassword; // `pre('save')` middleware handles hashing
    await user.save();

    res.status(200).json({ message: 'Password updated successfully' });
  } catch (err) {
    console.error('❌ Password update error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// PREVENT email update
exports.updateSettings = async (req, res) => {
  try {
    const updates = { ...req.body };

    // Strip any sensitive fields that must not be updated
    delete updates.email;
    delete updates.password;
    delete updates.role;
    delete updates.walletAddress;
    delete updates.createdAt;
    delete updates.updatedAt;

    const user = await User.findByIdAndUpdate(
      req.user.userId,
      updates,
      { new: true, runValidators: true }
    ).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ success: true, user });
  } catch (err) {
    console.error("❌ Settings update error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};


// ADMIN: Get all users
exports.getAllUsers = async (req, res) => {
  if (req.user.role !== 'admin' && req.user.role !== 'superadmin') {
    return res.status(403).json({ message: 'Unauthorized access' });
  }

  try {
    const users = await User.find().select('-password');
    res.status(200).json({ users });
  } catch (err) {
    console.error('❌ Fetch all users error:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// DELETE account
exports.deleteAccount = async (req, res) => {
  try {
    const deleted = await User.findByIdAndDelete(req.user.userId);
    if (!deleted) return res.status(404).json({ message: 'User not found' });

    res.status(200).json({ message: 'Account deleted successfully' });
  } catch (err) {
    console.error('❌ Delete error:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
};
