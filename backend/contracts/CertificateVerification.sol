// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";

contract CertificateVerification is Ownable {
    
    struct Certificate {
        string certificateId;
        string documentHash;
        string studentNameHash;
        address issuer;
        uint256 issueTimestamp;
        bool revoked;
        string ipfsCid;
    }

    mapping(address => bool) public isAuthorizedIssuer;
    mapping(string => Certificate) private certificates;
    mapping(string => bool) private certificateExists;

    event IssuerAuthorized(address indexed issuer);
    event IssuerRemoved(address indexed issuer);
    event CertificateIssued(string certificateId, string documentHash, address indexed issuer);
    event CertificateRevoked(string certificateId, address indexed revoker);

    constructor() Ownable(msg.sender) {
        // By default, the owner is an authorized issuer
        isAuthorizedIssuer[msg.sender] = true;
    }

    modifier onlyAuthorizedIssuer() {
        require(isAuthorizedIssuer[msg.sender], "Not an authorized issuer");
        _;
    }

    // --- Admin Functions ---

    function authorizeIssuer(address issuer) external onlyOwner {
        require(!isAuthorizedIssuer[issuer], "Issuer already authorized");
        isAuthorizedIssuer[issuer] = true;
        emit IssuerAuthorized(issuer);
    }

    function removeIssuer(address issuer) external onlyOwner {
        require(isAuthorizedIssuer[issuer], "Issuer not authorized");
        isAuthorizedIssuer[issuer] = false;
        emit IssuerRemoved(issuer);
    }

    // --- Certificate Functions ---

    function issueCertificate(
        string memory _certificateId,
        string memory _documentHash,
        string memory _studentNameHash,
        string memory _ipfsCid
    ) external onlyAuthorizedIssuer {
        require(!certificateExists[_certificateId], "Certificate ID already exists");
        
        certificates[_certificateId] = Certificate({
            certificateId: _certificateId,
            documentHash: _documentHash,
            studentNameHash: _studentNameHash,
            issuer: msg.sender,
            issueTimestamp: block.timestamp,
            revoked: false,
            ipfsCid: _ipfsCid
        });
        
        certificateExists[_certificateId] = true;
        
        emit CertificateIssued(_certificateId, _documentHash, msg.sender);
    }

    function verifyCertificate(string memory _certificateId) external view returns (
        bool exists,
        string memory certificateId,
        string memory documentHash,
        address issuer,
        uint256 issueTimestamp,
        bool revoked,
        string memory ipfsCid
    ) {
        if (!certificateExists[_certificateId]) {
            return (false, "", "", address(0), 0, false, "");
        }
        
        Certificate memory cert = certificates[_certificateId];
        return (
            true,
            cert.certificateId,
            cert.documentHash,
            cert.issuer,
            cert.issueTimestamp,
            cert.revoked,
            cert.ipfsCid
        );
    }

    function revokeCertificate(string memory _certificateId) external {
        require(certificateExists[_certificateId], "Certificate does not exist");
        Certificate storage cert = certificates[_certificateId];
        require(!cert.revoked, "Certificate already revoked");
        
        // Only the owner or the original issuer can revoke
        require(msg.sender == owner() || msg.sender == cert.issuer, "Not authorized to revoke");
        
        cert.revoked = true;
        emit CertificateRevoked(_certificateId, msg.sender);
    }
}
