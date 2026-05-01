const qrcode = require('qrcode');
const env = require('../config/env');
const hashFile = require('../utils/hashFile');
const hashString = require('../utils/hashString');
const { uploadToIPFS } = require('../services/ipfsService');
const { issueCertificateOnChain, verifyCertificateOnChain, revokeCertificateOnChain } = require('../services/blockchainService');
const certificateStore = require('../services/certificateStore');

// POST /api/certificates/issue
const issueCertificate = async (req, res, next) => {
  try {
    const { studentName, rollNo, course, issueDate, certificateId } = req.body;
    const file = req.file;

    if (!studentName || !rollNo || !course || !issueDate || !certificateId || !file) {
      return res.status(400).json({ success: false, message: 'Missing required fields or file' });
    }

    // 1. Hash the PDF file
    const documentHash = await hashFile(file.path);

    // 2. Hash student name
    const studentNameHash = hashString(studentName.toLowerCase().trim());

    // 3. Upload to IPFS (Optional)
    let ipfsCid = "";
    try {
      ipfsCid = await uploadToIPFS(file.path);
    } catch (err) {
      console.error("IPFS warning:", err.message);
      // Continue even if IPFS fails
    }

    // 4. Issue on blockchain
    const txHash = await issueCertificateOnChain(certificateId, documentHash, studentNameHash, ipfsCid);

    // 5. Generate QR Code
    const verificationUrl = `${env.FRONTEND_BASE_URL}/verify?certificateId=${certificateId}`;
    const qrData = await qrcode.toDataURL(verificationUrl);

    // 6. Save locally
    const certRecord = {
      studentName,
      rollNo,
      course,
      issueDate,
      certificateId,
      documentHash,
      studentNameHash,
      txHash,
      ipfsCid,
      revoked: false,
      fileName: file.filename
    };
    certificateStore.addCertificate(certRecord);

    res.status(201).json({
      success: true,
      certificateId,
      documentHash,
      studentNameHash,
      transactionHash: txHash,
      verificationUrl,
      qrData,
      ipfsCid
    });
  } catch (error) {
    if (error.message.includes('already exists')) {
       return res.status(400).json({ success: false, message: 'Certificate ID already exists' });
    }
    next(error);
  }
};

// GET /api/certificates/verify/:certificateId
const verifyCertificate = async (req, res, next) => {
  try {
    const { certificateId } = req.params;
    console.log(`[DEBUG] Backend Verify: Received lookup request for ID: ${certificateId}`);
    
    // Attempt blockchain lookup
    console.log(`[DEBUG] Backend Verify: Starting blockchain lookup...`);
    const onChainData = await verifyCertificateOnChain(certificateId);

    if (!onChainData.exists) {
      console.log(`[DEBUG] Backend Verify: Lookup finished - Certificate NOT FOUND`);
      return res.status(404).json({ success: false, status: 'NOT_FOUND', message: 'Certificate not found' });
    }

    console.log(`[DEBUG] Backend Verify: Lookup finished - Certificate FOUND!`);
    const status = onChainData.revoked ? 'REVOKED' : 'VALID';

    res.status(200).json({
      success: true,
      status,
      ...onChainData
    });
  } catch (error) {
    console.error(`[DEBUG] Backend Verify: Error during blockchain lookup!`, error.message);
    if (error.message.includes('call revert exception') || error.message.includes('missing revert data')) {
       return res.status(404).json({ success: false, status: 'NOT_FOUND', message: 'Certificate not found (Blockchain exception)' });
    }
    if (error.code === 'BAD_DATA' || error.message.includes('could not decode result data')) {
       return res.status(500).json({ success: false, message: 'Contract address or ABI mismatch. Are you sure the contract is deployed on this network at this address?' });
    }
    res.status(500).json({ success: false, message: 'Contract call failed', error: error.message });
  }
};

// POST /api/certificates/revoke/:certificateId
const revokeCertificate = async (req, res, next) => {
  try {
    const { certificateId } = req.params;

    const txHash = await revokeCertificateOnChain(certificateId);
    certificateStore.updateCertificateStatus(certificateId, true);

    res.status(200).json({
      success: true,
      message: 'Certificate revoked successfully',
      transactionHash: txHash
    });
  } catch (error) {
    next(error);
  }
};

// GET /api/certificates
const getCertificates = async (req, res, next) => {
  try {
    const certs = certificateStore.getAllCertificates();
    res.status(200).json({ success: true, data: certs });
  } catch (error) {
    next(error);
  }
};

// POST /api/certificates/verify-file/:certificateId
const verifyFile = async (req, res, next) => {
  try {
    const { certificateId } = req.params;
    const file = req.file;

    if (!file) {
      return res.status(400).json({ success: false, message: 'PDF file is required' });
    }

    const documentHash = await hashFile(file.path);
    const onChainData = await verifyCertificateOnChain(certificateId);

    if (!onChainData.exists) {
      return res.status(404).json({ success: false, status: 'NOT_FOUND', message: 'Certificate not found on chain' });
    }

    const match = documentHash === onChainData.documentHash;

    res.status(200).json({
      success: true,
      match,
      uploadedHash: documentHash,
      onChainHash: onChainData.documentHash,
      status: onChainData.revoked ? 'REVOKED' : (match ? 'VALID' : 'INVALID_FILE')
    });

  } catch (error) {
    next(error);
  }
};

module.exports = {
  issueCertificate,
  verifyCertificate,
  revokeCertificate,
  getCertificates,
  verifyFile
};
