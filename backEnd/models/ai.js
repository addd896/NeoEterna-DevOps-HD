const mongoose = require('mongoose');

// Define the schema for AI verification results
const aiSchema = new mongoose.Schema({
  // Original filename of the uploaded file that was verified
  filename: {
    type: String,
    required: true // This field must be provided
  },
  
  // Result of the AI verification process: either "authentic" or "forged"
  result: {
    type: String,
    enum: ['authentic', 'forged'], // Only allow specific values
    required: true
  },
  
  // Confidence score returned by the AI model (e.g., 0.92 = 92%)
  confidence: {
    type: Number,
    required: true
  },
  
  // Timestamp when the verification record was created
  createdAt: {
    type: Date,
    default: Date.now // Defaults to the current date/time
  }
});

// Export the model, associating it with the 'AI' collection in MongoDB
module.exports = mongoose.model('AI', aiSchema);
