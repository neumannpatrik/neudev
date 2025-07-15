const express = require('express');
const router = express.Router();

const authRoutes = require('./auth');
const projectRoutes = require('./projects');
const activityRoutes = require('./activities');
const { authenticateToken, requireAdmin } = require('../middleware/auth');
const prisma = require('../config/database');

router.use('/auth', authRoutes);
router.use('/projects', projectRoutes);
router.use('/activities', activityRoutes);

// List all users (admin only)
router.get('/users', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      select: { id: true, name: true, email: true, isAdmin: true }
    });
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch users.' });
  }
});

// Health check route
router.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

module.exports = router; 