// controllers/verificationController.js

const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');
const path = require('path');
const ai = require('../models/ai');
const aiService = require('../services/aiService');

// Handle file verification request using the external FastAPI AI service
exports.verifyFile = async (req, res) => {
  try {
    const filePath = req.file.path;

    // Prepare multipart/form-data payload with the uploaded file
    const form = new FormData();
    form.append('file', fs.createReadStream(filePath));

    // URL of the local FastAPI verification microservice
    const aiApiURL = 'http://localhost:8000/api/verify';

    // Send POST request to the FastAPI server with file data
    const response = await axios.post(aiApiURL, form, {
      headers: form.getHeaders()
    });

     const { forgery, confidence, label_detected } = response.data;

    // Convert forgery boolean to "authentic"/"forged"
     const result = forgery ? "forged" : "authentic";

      // Save to database
     await ai.create({
    filename: req.file.originalname,
    result,
    confidence: confidence / 100 // Convert 79 → 0.79 if needed
    });


    // Ensure result and confidence exist and are valid
    if (!['authentic', 'forgery', 'forged'].includes(result) || typeof confidence !== 'number') {
      throw new Error(`AI validation failed: Invalid result or confidence from AI service: ${JSON.stringify(response.data)}`);
    }

    // Normalize "forgery" to "forged" if needed
    const normalizedResult = result === "forgery" ? "forged" : result;

    // Log the verification result in the database (for audit/history)
    await ai.create({
      filename: req.file.originalname,
      result: normalizedResult,
      confidence
    });

    // Respond back to the frontend with AI verification outcome
    return res.status(200).json({
      success: true,
      result: normalizedResult,
      confidence
    });

  } catch (error) {
    // Handle and log any error that occurred during the process
    console.error('AI Verification Error:', error.message);
    return res.status(500).json({ success: false, error: error.message });
  }
};
