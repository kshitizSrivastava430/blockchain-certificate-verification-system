const express = require('express');
const router = express.Router();
const { login, logout, checkAuth } = require('../controllers/adminController');
const { protectAdminRoute } = require('../middleware/authMiddleware');

router.post('/login', login);
router.post('/logout', logout);
router.get('/me', protectAdminRoute, checkAuth);

module.exports = router;
