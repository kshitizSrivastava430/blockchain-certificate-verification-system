const path = require('path');
const dotenv = require('dotenv');

// Only try to load .env from file if we are not in production
// In production (Render), we rely entirely on the environment variables set in the dashboard.
if (process.env.NODE_ENV !== 'production') {
  dotenv.config({ path: path.join(__dirname, '../../../../.env') }); // safe path resolution
  // Wait, the root .env is at `../../../.env` from `src/config/` ?
  // __dirname is `backend/src/config`
  // ../../../.env is `block chain/.env`
  dotenv.config({ path: path.join(__dirname, '../../../.env') });
}

module.exports = {
  PORT: process.env.PORT || 5001,
  RPC_URL: process.env.RPC_URL,
  PRIVATE_KEY: process.env.PRIVATE_KEY,
  CONTRACT_ADDRESS: process.env.CONTRACT_ADDRESS,
  FRONTEND_BASE_URL: process.env.FRONTEND_BASE_URL || 'http://localhost:3000',
  ENABLE_IPFS: process.env.ENABLE_IPFS === 'true',
  PINATA_JWT: process.env.PINATA_JWT,
  
  // Admin Authentication
  ADMIN_USERNAME: process.env.ADMIN_USERNAME || 'admin',
  ADMIN_PASSWORD: process.env.ADMIN_PASSWORD || 'admin123',
  JWT_SECRET: process.env.JWT_SECRET || 'super-secret-jwt-key-change-in-production',
  NODE_ENV: process.env.NODE_ENV || 'development'
};
