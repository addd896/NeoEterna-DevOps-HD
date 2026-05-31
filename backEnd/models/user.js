// models/user.js
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs"); // Library for hashing passwords
const jwt = require("jsonwebtoken"); // Used to generate JWT tokens

// Define the schema for the User model
const userSchema = new mongoose.Schema(
  {
    // Basic Information
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true, // Enforces email uniqueness
      lowercase: true, // Normalizes case for comparison
      trim: true, // Removes whitespace
      match: [
        /^([\w-]+(?:\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7})$/,
        'Please enter a valid email'
      ], // Basic email format validation
    },
    phoneNumber: {
      type: String,
      required: false, // Optional field for contact number
    },

    // Authentication and Security
    password: {
      type: String,
      required: true,
      select: false // Prevent password from being returned in queries by default
    },
    passwordResetToken: {
      type: String, // Token for password reset functionality
    },
    passwordResetExpires: {
      type: Date, // Expiry timestamp for the reset token
    },
    isVerified: {
      type: Boolean,
      default: false // Indicates if the user's email is verified
    },
    walletAddress: {
      type: String,
      required: false, // Optional: for users authenticating via crypto wallets
      unique: true,
      sparse: true // Allows multiple nulls but still enforces uniqueness when value is present
    },

    // Role-Based Access Control
    role: {
      type: String,
      enum: ['user', 'admin', 'superadmin'], // Predefined user roles
      default: 'user' // Default role assignment
    },

    // Additional Info
    profilePicture: {
      type: String,
      default: 'default-profile.png' // Default profile picture if not set
    },
    lastLogin: {
      type: Date // Tracks last login timestamp
    },

    // Manual Timestamps (deprecated in favor of Mongoose `timestamps` option)
    createdAt: {
      type: Date,
      default: Date.now
    },
    updatedAt: {
      type: Date,
      default: Date.now
    },
   notificationPreferences: {
   notifications: {
    type: Boolean,
    default: true
  }
}
  },
  {
    timestamps: true // Automatically adds createdAt and updatedAt fields
  }
);

// Middleware to hash password before saving the user document
userSchema.pre('save', async function (next) {
  // Only hash if the password has been modified
  if (!this.isModified('password')) return next();

  // Generate salt and hash password
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Instance method to compare entered password with stored hash
userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Instance method to generate a signed JWT token
userSchema.methods.generateAuthToken = function () {
  const token = jwt.sign(
    {
      userId: this._id,
      role: this.role,
      walletAddress: this.walletAddress
    },
    process.env.JWT_SECRET,
    {
      expiresIn: '7d' // Token valid for 7 days
    }
  );
  return token;
};

// Instance method to generate a password reset token (valid for 1 hour)
userSchema.methods.generatePasswordResetToken = function () {
  const resetToken = jwt.sign(
    { userId: this._id },
    process.env.JWT_SECRET,
    { expiresIn: '1h' }
  );
  this.passwordResetToken = resetToken;
  this.passwordResetExpires = Date.now() + 3600000; // 1 hour from now
  return resetToken;
};

// Compile schema into a model and export it
const UserModel = mongoose.model('User', userSchema);
module.exports = UserModel;
