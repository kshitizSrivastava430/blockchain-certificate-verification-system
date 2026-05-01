const crypto = require('crypto');

/**
 * Generates SHA-256 hash from a string
 * @param {string} data - Input string
 * @returns {string} Hex encoded hash
 */
const hashString = (data) => {
  return crypto.createHash('sha256').update(data).digest('hex');
};

module.exports = hashString;
