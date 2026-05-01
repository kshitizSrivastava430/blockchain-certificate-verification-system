const { ethers } = require('ethers');
const env = require('./env');

// We need the ABI to interact with the contract
const contractABI = [
  "function issueCertificate(string _certificateId, string _documentHash, string _studentNameHash, string _ipfsCid) external",
  "function verifyCertificate(string _certificateId) external view returns (bool exists, string certificateId, string documentHash, address issuer, uint256 issueTimestamp, bool revoked, string ipfsCid)",
  "function revokeCertificate(string _certificateId) external",
  "function isAuthorizedIssuer(address issuer) external view returns (bool)"
];

let provider;
let wallet;
let contract;

// 1. Validate RPC_URL
let rpcUrl = env.RPC_URL ? env.RPC_URL.trim() : '';
if (!rpcUrl) {
  console.error("❌ CRITICAL ERROR: RPC_URL is missing in environment variables!");
  process.exit(1);
}
if (!rpcUrl.startsWith('https://')) {
  console.error("❌ CRITICAL ERROR: RPC_URL must start with https://");
  process.exit(1);
}
if (!rpcUrl.includes('eth-sepolia.g.alchemy.com')) {
  console.error("❌ CRITICAL ERROR: RPC_URL must contain eth-sepolia.g.alchemy.com");
  process.exit(1);
}

// 2. Validate and Normalize PRIVATE_KEY
let pk = env.PRIVATE_KEY ? env.PRIVATE_KEY.trim() : '';
if (!pk) {
  console.error("❌ CRITICAL ERROR: PRIVATE_KEY is missing in environment variables!");
  process.exit(1);
}
if (!pk.startsWith('0x')) {
  pk = '0x' + pk;
}
if (pk.length !== 66) { // 0x + 64 hex chars
  console.error("❌ CRITICAL ERROR: PRIVATE_KEY format is invalid! Must be 64 hex characters.");
  process.exit(1);
}

// 3. Validate CONTRACT_ADDRESS
let contractAddr = env.CONTRACT_ADDRESS ? env.CONTRACT_ADDRESS.trim() : '';
if (!contractAddr) {
  console.error("❌ CRITICAL ERROR: CONTRACT_ADDRESS is missing in environment variables!");
  process.exit(1);
}
if (!contractAddr.startsWith('0x') || contractAddr.length !== 42) {
  console.error("❌ CRITICAL ERROR: CONTRACT_ADDRESS format is invalid!");
  process.exit(1);
}

// Initialize
try {
  console.log(`Using contract address: ${contractAddr.slice(0, 6)}...${contractAddr.slice(-4)}`);
  provider = new ethers.JsonRpcProvider(rpcUrl);
  wallet = new ethers.Wallet(pk, provider);
  contract = new ethers.Contract(contractAddr, contractABI, wallet);
} catch (error) {
  console.error("❌ CRITICAL ERROR: Failed to initialize blockchain instances:", error.message);
  process.exit(1);
}

module.exports = {
  provider,
  wallet,
  contract
};
