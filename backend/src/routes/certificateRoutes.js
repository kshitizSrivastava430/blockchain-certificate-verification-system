const express = require('express');
const upload = require('../middleware/uploadMiddleware');
const { protectAdminRoute } = require('../middleware/authMiddleware');
const {
  issueCertificate,
  verifyCertificate,
  revokeCertificate,
  getCertificates,
  verifyFile
} = require('../controllers/certificateController');

const router = express.Router();

// Protected Admin Routes
router.post('/issue', protectAdminRoute, upload.single('certificate'), issueCertificate);
router.post('/revoke/:certificateId', protectAdminRoute, revokeCertificate);
router.get('/', protectAdminRoute, getCertificates);

// Public Verification Routes
router.get('/verify/:certificateId', verifyCertificate);
router.post('/verify-file/:certificateId', upload.single('certificate'), verifyFile);

module.exports = router;
