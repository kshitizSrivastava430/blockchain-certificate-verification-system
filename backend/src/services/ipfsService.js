const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');
const env = require('../config/env');

const uploadToIPFS = async (filePath) => {
  if (!env.ENABLE_IPFS) {
    return "";
  }
  
  if (!env.PINATA_JWT) {
    console.warn("IPFS enabled but no PINATA_JWT found.");
    return "";
  }

  try {
    const formData = new FormData();
    formData.append('file', fs.createReadStream(filePath));
    
    const res = await axios.post("https://api.pinata.cloud/pinning/pinFileToIPFS", formData, {
      headers: {
        'Authorization': `Bearer ${env.PINATA_JWT}`,
        ...formData.getHeaders()
      }
    });
    
    return res.data.IpfsHash;
  } catch (error) {
    console.error("IPFS Upload Error:", error.response ? error.response.data : error.message);
    throw new Error("Failed to upload to IPFS");
  }
};

module.exports = {
  uploadToIPFS
};
