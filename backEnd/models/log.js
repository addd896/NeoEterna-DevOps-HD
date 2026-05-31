const mongoose = require("mongoose");

const logSchema = new mongoose.Schema({
  event: {
    type: String,
    required: true,
  },
  wallet: {
    type: String,
    required: true,
  },
  capsuleId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Capsule",
  },
  timestamp: {
    type: Date,
    default: Date.now,
  }
});

module.exports = mongoose.model("Log", logSchema);
