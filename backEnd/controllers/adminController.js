// controllers/adminController.js

const Capsule = require('../models/capsule');
const User = require('../models/user');

// This is a placeholder route. Eventually, I plan to fetch actual logs from a logging service or database.
exports.getAuditLogs = async (req, res) => {
  res.json([
    { type: 'auth', message: 'User login', timestamp: Date.now() },
    { type: 'storage', message: 'File uploaded to Arweave', timestamp: Date.now() },
  ]);
};

// This lets me flag a capsule—for example, if it contains inappropriate content.
// Right now, I'm just setting a 'flagged' field, but later I might implement a full moderation system.
exports.flagContent = async (req, res) => {
  const { capsuleId, reason } = req.body;
  await Capsule.findByIdAndUpdate(capsuleId, {
    flagged: true,
    flaggedReason: reason,
  });
  res.json({ success: true, message: 'Content flagged' });
};

// This endpoint is for banning a user by their wallet address.
// I update the user document and mark them as banned.
exports.banUser = async (req, res) => {
  const { walletAddress } = req.body;
  await User.findOneAndUpdate({ wallet: walletAddress }, { banned: true });
  res.json({ success: true, message: `User ${walletAddress} banned.` });
};

// Here I'm collecting basic admin stats—total capsules, users, and API uptime.
// Later, I might add more advanced metrics like smart contract gas usage or AI model performance.
exports.getAdminStats = async (req, res) => {
  const totalCapsules = await Capsule.countDocuments();
  const totalUsers = await User.countDocuments();

  const gasUsed = 0;

  const verified = await Capsule.countDocuments({ status: "verified" });
  const totalVerified = await Capsule.countDocuments({ status: { $in: ["verified", "forged"] } });
  const verificationRate = totalVerified ? Math.round((verified / totalVerified) * 100) : 0;

  res.json({
    capsulesStored: totalCapsules,
    users: totalUsers,
     gasUsed,
    verificationRate,
    uptime: process.uptime(),
  });
};
