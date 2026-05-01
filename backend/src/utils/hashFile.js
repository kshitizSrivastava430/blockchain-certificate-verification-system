const crypto = require('crypto');
const fs = require('fs');

/**
 * Generates SHA-256 hash from a file
 * @param {string} filePath - Path to the file
 * @returns {Promise<string>} Hex encoded hash
 */
const hashFile = (filePath) => {
  return new Promise((resolve, reject) => {
    const hash = crypto.createHash('sha256');
    const stream = fs.createReadStream(filePath);
    
    stream.on('error', err => reject(err));
    stream.on('data', chunk => hash.update(chunk));
    stream.on('end', () => resolve(hash.digest('hex')));
  });
};

module.exports = hashFile;
