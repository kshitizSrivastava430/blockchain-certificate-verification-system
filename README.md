# BlockCert: Immutable Credential Verification

A complete, hackathon-ready full-stack application to issue, manage, and cryptographically verify academic and professional certificates using the **Sepolia Testnet** and IPFS.

## 🌟 1. Project Overview

BlockCert solves the problem of certificate forgery. Instead of relying on central databases, the system computes a SHA-256 hash of a PDF document and commits it to a Solidity Smart Contract. End-users can instantly verify the authenticity of any document using Zero-Knowledge mathematical proofs without needing an account.

## 🏗 2. Architecture

The project has been refactored for a robust production deployment:

- **Frontend (Deployed on Vercel)**: Next.js 15 (App Router) with Tailwind CSS, utilizing a cyberpunk/Web3 UI.
- **Backend (Deployed on Render)**: Node.js & Express.js. Handles file hashing, IPFS interactions, and blockchain transactions via Ethers.js.
- **Smart Contract (Deployed on Sepolia)**: Solidity contract storing immutable certificate hashes and metadata.
- **Verification Flow**: 
  1. Admin uploads PDF -> 2. Backend hashes PDF locally -> 3. Hash is stored on Sepolia -> 4. User queries Sepolia via Frontend.

## 🌐 3. Live Demo

- **Frontend Application**: [https://blockchain-certificate-verification-rho.vercel.app](https://blockchain-certificate-verification-rho.vercel.app)
- **Backend API Health**: [https://certificate-verification-backend-66pw.onrender.com/api/health](https://certificate-verification-backend-66pw.onrender.com/api/health)

*(Note: The backend is deployed completely separately from the frontend to allow for secure cross-origin requests and blockchain interactions).*

## 💻 4. Local Development Setup

To run the project locally, open three separate terminals.

### Terminal 1: Blockchain
Ensure you have a root `.env` file (see the Environment Variables section) with a valid Alchemy `RPC_URL` and Metamask `PRIVATE_KEY`.
```bash
npm install
npm run node:local
```
*(You can also use Sepolia for local testing if you skip `node:local` and just use your Alchemy RPC).*

### Terminal 2: Backend
The backend runs independently. It no longer relies on the root `.env` file in production, but locally it will read it for convenience.
```bash
cd backend
npm install
npm run dev
```

### Terminal 3: Frontend
The frontend requires the backend API URL.
```bash
cd frontend
npm install
```
Create `frontend/.env.local`:
```env
NEXT_PUBLIC_API_URL=http://localhost:5001
NEXT_PUBLIC_FRONTEND_URL=http://localhost:3000
```
Start the frontend:
```bash
npm run dev
```

## ☁️ 5. Production Deployment

### Frontend (Vercel)
- **Root Directory**: `frontend`
- **Environment Variables**:
  ```env
  NEXT_PUBLIC_API_URL=https://certificate-verification-backend-66pw.onrender.com
  NEXT_PUBLIC_FRONTEND_URL=https://blockchain-certificate-verification-rho.vercel.app
  ```
*(Note: The frontend code automatically appends `/api` to the `NEXT_PUBLIC_API_URL`, so the root backend URL is all that is required here).*

### Backend (Render)
- **Root Directory**: `backend`
- **Build Command**: `npm install`
- **Start Command**: `npm start`
- **Environment Variables**:
  ```env
  NODE_ENV=production
  PORT=5001
  ADMIN_USERNAME=eternal2026
  ADMIN_PASSWORD=god@1244
  JWT_SECRET=YOUR_SECURE_SECRET
  RPC_URL=https://eth-sepolia.g.alchemy.com/v2/YOUR_ALCHEMY_KEY
  PRIVATE_KEY=YOUR_PRIVATE_KEY
  CONTRACT_ADDRESS=YOUR_SEPOLIA_CONTRACT_ADDRESS
  FRONTEND_BASE_URL=https://blockchain-certificate-verification-rho.vercel.app,http://localhost:3000
  ENABLE_IPFS=false
  ```
*(Note: In production, the backend strictly ignores any local `.env` files and relies entirely on these Render environment variables).*

## 📜 6. Smart Contract Deployment

To deploy a fresh contract to the Sepolia testnet:

1. Ensure your root `.env` contains your `RPC_URL` and `PRIVATE_KEY`.
2. Run from the root directory:
   ```bash
   npm install
   npx hardhat compile
   npm run deploy:sepolia
   ```
3. Copy the outputted contract address and set it as `CONTRACT_ADDRESS` in your Render Environment Variables.

## 🔐 7. Environment Variables Reference

### Root / Blockchain (`/.env`)
Used for Hardhat deployments and local backend fallback.
```env
RPC_URL=https://eth-sepolia.g.alchemy.com/v2/YOUR_KEY
PRIVATE_KEY=YOUR_METAMASK_PRIVATE_KEY
CONTRACT_ADDRESS=0xYOUR_CONTRACT_ADDRESS
```

### Backend (`/backend/.env`)
Used for local backend testing only.
```env
PORT=5001
ADMIN_USERNAME=eternal2026
ADMIN_PASSWORD=god@1244
JWT_SECRET=local-dev-secret
FRONTEND_BASE_URL=http://localhost:3000
```

### Frontend (`/frontend/.env.local`)
```env
NEXT_PUBLIC_API_URL=http://localhost:5001
NEXT_PUBLIC_FRONTEND_URL=http://localhost:3000
```

## 🛠 8. Troubleshooting

- **"401 Unauthorized / Must be authenticated!" from Alchemy**
  - **Cause**: Invalid or stale `RPC_URL` in the backend.
  - **Fix**: Verify your Render environment variables. Ensure no quotes are surrounding the URL. Check the safe startup logs in Render (`Using RPC_URL: Alchemy Sepolia (...abc123)`) to confirm the correct key is actively loaded.

- **"Admin login works locally but fails on Vercel"**
  - **Cause**: Frontend pointing to localhost or CORS mismatch.
  - **Fix**: Ensure `NEXT_PUBLIC_API_URL` in Vercel is set to your Render URL. Verify the backend `FRONTEND_BASE_URL` allows your exact Vercel domain.

- **"Uploads disappear on Render"**
  - **Cause**: Render's filesystem is ephemeral. We use `/tmp` for processing, which is wiped out.
  - **Fix**: This is intentional. The system only needs the PDF temporarily to generate a SHA-256 hash. If you need permanent PDF hosting, set `ENABLE_IPFS=true`.

- **"Transaction fails on Sepolia"**
  - **Cause**: The deployment wallet lacks Sepolia ETH, or the `CONTRACT_ADDRESS` is wrong.
  - **Fix**: Fund your wallet via a Sepolia faucet, or redeploy the contract and update the environment variable.

## 🛡 9. Security Notes

- **Never commit `.env` files.** They are included in `.gitignore`.
- **Never expose your `PRIVATE_KEY`** in screenshots, logs, or client-side code.
- If a private key is accidentally exposed, transfer any funds and **abandon the wallet immediately**.
- Only use the `.env.example` files provided to share configuration templates with teammates.

---
*Built with ❤️ for Hackathons. Designed for the Future.*
