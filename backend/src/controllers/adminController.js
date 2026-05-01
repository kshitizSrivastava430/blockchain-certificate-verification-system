const jwt = require('jsonwebtoken');
const env = require('../config/env');

const login = (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ success: false, message: 'Username and password are required' });
  }

  if (username === env.ADMIN_USERNAME && password === env.ADMIN_PASSWORD) {
    // Sign JWT token
    const token = jwt.sign(
      { username, role: 'admin' },
      env.JWT_SECRET,
      { expiresIn: '8h' }
    );

    const isProd = process.env.NODE_ENV === 'production';

    // Set HTTP-only cookie
    res.cookie('token', token, {
      httpOnly: true,
      secure: isProd, // Must be true in production for cross-origin
      sameSite: isProd ? 'none' : 'lax', // 'none' allows cross-origin on Vercel/Render
      maxAge: 8 * 60 * 60 * 1000 // 8 hours
    });

    return res.status(200).json({ success: true, message: 'Logged in successfully' });
  }

  return res.status(401).json({ success: false, message: 'Invalid credentials' });
};

const logout = (req, res) => {
  const isProd = process.env.NODE_ENV === 'production';
  
  res.clearCookie('token', {
    httpOnly: true,
    secure: isProd,
    sameSite: isProd ? 'none' : 'lax'
  });
  return res.status(200).json({ success: true, message: 'Logged out successfully' });
};

const checkAuth = (req, res) => {
  // If the request reaches here, it means it passed the authMiddleware
  res.status(200).json({ success: true, user: req.user });
};

module.exports = {
  login,
  logout,
  checkAuth
};
