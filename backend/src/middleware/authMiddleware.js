const jwt = require('jsonwebtoken');
const env = require('../config/env');

const protectAdminRoute = (req, res, next) => {
  const token = req.cookies?.token;

  if (!token) {
    return res.status(401).json({ success: false, message: 'Not authorized, no token' });
  }

  try {
    const decoded = jwt.verify(token, env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    console.error('Auth error:', error.message);
    res.status(401).json({ success: false, message: 'Not authorized, token failed' });
  }
};

module.exports = {
  protectAdminRoute
};
