const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const certificateRoutes = require('./routes/certificateRoutes');
const adminRoutes = require('./routes/adminRoutes');
const errorHandler = require('./middleware/errorHandler');

const app = express();

const allowedOrigins = process.env.FRONTEND_BASE_URL 
  ? process.env.FRONTEND_BASE_URL.split(',').map(url => url.trim().replace(/\/$/, '')) // Remove trailing slashes
  : ['http://localhost:3000'];

app.use(cors({
  origin: function (origin, callback) {
    // allow requests with no origin like mobile apps or curl requests
    if (!origin) return callback(null, true);
    
    // remove trailing slash from origin for comparison
    const originToCheck = origin.replace(/\/$/, '');
    
    if (allowedOrigins.includes(originToCheck)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));
app.use(express.json());
app.use(cookieParser());

// Health Check
app.get('/api/health', (req, res) => {
  res.status(200).json({ success: true, message: 'API is running' });
});

// TEMPORARY DEBUG ROUTE
app.get('/api/debug/verify-info', (req, res) => {
  const env = require('./config/env');
  
  res.status(200).json({
    verifyRoute: "/api/certificates/verify/:certificateId",
    backendHealthy: true,
    corsFrontendAllowed: !!env.FRONTEND_BASE_URL,
    rpcConfigured: !!env.RPC_URL
  });
});

// Routes
app.use('/api/admin', adminRoutes);
app.use('/api/certificates', certificateRoutes);

// Error Handling
app.use(errorHandler);

module.exports = app;
