const crypto = require("crypto");

// Encryption algorithm: AES with 256-bit key in CBC mode
const algorithm = "aes-256-cbc";

// Secret key from environment variable (.env), must be 32 bytes
const secretKey = process.env.ENCRYPTION_SECRET_KEY;

/**
 * Generates a 16-byte initialization vector (IV)
 * - IV ensures that the same plaintext encrypts differently each time
 * - Required for AES-CBC mode
 * 
 * @returns {Buffer} 16-byte IV
 */
function generateIV() {
  return crypto.randomBytes(16);
}

/**
 * Encrypts a file buffer using AES-256-CBC
 * - Prepends the IV to the encrypted data for use during decryption
 * 
 * @param {Buffer} buffer - Original file data
 * @returns {Buffer} Encrypted file with IV prefixed
 */
function encryptFile(buffer) {
  const secretKey = process.env.ENCRYPTION_SECRET_KEY; // Load from env again in case of runtime changes
  const iv = generateIV(); // Generate random IV
  const cipher = crypto.createCipheriv(algorithm, Buffer.from(secretKey), iv);

  let encrypted = cipher.update(buffer); // Encrypt the data
  encrypted = Buffer.concat([encrypted, cipher.final()]); // Finalize encryption

  return Buffer.concat([iv, encrypted]); // Combine IV + encrypted data
}

/**
 * Decrypts a buffer that was previously encrypted by `encryptFile`
 * - Extracts the IV from the start of the buffer
 * 
 * @param {Buffer} encryptedBuffer - Buffer that includes IV + encrypted data
 * @returns {Buffer} Decrypted original data
 */
function decryptFile(encryptedBuffer) {
  const iv = encryptedBuffer.slice(0, 16); // First 16 bytes = IV
  const encryptedData = encryptedBuffer.slice(16); // Remaining bytes = actual encrypted content

  const decipher = crypto.createDecipheriv(algorithm, Buffer.from(secretKey), iv);

  let decrypted = decipher.update(encryptedData); // Decrypt the content
  decrypted = Buffer.concat([decrypted, decipher.final()]); // Finalize decryption

  return decrypted;
}

// Export both encryption and decryption functions
module.exports = {
  encryptFile,
  decryptFile,
};
