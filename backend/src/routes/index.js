const express = require('express');
const router = express.Router();

// Import route modules
// const userRoutes = require('./users');
// const projectRoutes = require('./projects');
// const skillRoutes = require('./skills');

// Define routes
// router.use('/users', userRoutes);
// router.use('/projects', projectRoutes);
// router.use('/skills', skillRoutes);

// Health check route
router.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

module.exports = router; 