const { contract } = require('../config/blockchain');

const issueCertificateOnChain = async (certificateId, documentHash, studentNameHash, ipfsCid) => {
  if (!contract) throw new Error("Blockchain not configured");
  
  const tx = await contract.issueCertificate(
    certificateId, 
    documentHash, 
    studentNameHash, 
    ipfsCid || ""
  );
  const receipt = await tx.wait();
  return receipt.hash;
};

const verifyCertificateOnChain = async (certificateId) => {
  if (!contract) throw new Error("Blockchain not configured");

  const result = await contract.verifyCertificate(certificateId);
  return {
    exists: result.exists,
    certificateId: result.certificateId,
    documentHash: result.documentHash,
    issuer: result.issuer,
    issueTimestamp: Number(result.issueTimestamp),
    revoked: result.revoked,
    ipfsCid: result.ipfsCid
  };
};

const revokeCertificateOnChain = async (certificateId) => {
  if (!contract) throw new Error("Blockchain not configured");

  const tx = await contract.revokeCertificate(certificateId);
  const receipt = await tx.wait();
  return receipt.hash;
};

module.exports = {
  issueCertificateOnChain,
  verifyCertificateOnChain,
  revokeCertificateOnChain
};
