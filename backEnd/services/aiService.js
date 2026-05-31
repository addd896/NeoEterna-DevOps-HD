const axios = require("axios");
const FormData = require("form-data");

// verifyFile()
// Sends a file buffer to the AI verification API (FastAPI) and returns the response
//
// @param fileBuffer - A Buffer containing the file's binary data
// @param originalName - Optional filename string for the uploaded file (default: "upload.bin")
//
// @returns {Object} - The response from the FastAPI verification endpoint (e.g., { result, confidence })

const verifyFile = async (fileBuffer, originalName = "upload.bin") => {
  const form = new FormData();

  // Append the file to the form-data payload with necessary metadata
  form.append("file", fileBuffer, {
    filename: originalName,              // Set the filename for the uploaded file
    contentType: "application/octet-stream" // Set generic binary content type
  });

  // Send POST request to the FastAPI verification microservice
  const response = await axios.post("http://localhost:8000/api/verify", form, {
    headers: form.getHeaders(), // Set appropriate multipart/form-data headers
  });

  // Return the structured result (e.g., result: 'authentic', confidence: 0.95)
  return response.data;
};

// Export the utility for use in backend controllers or services
module.exports = { verifyFile };
