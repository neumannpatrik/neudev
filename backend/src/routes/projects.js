const express = require('express');
const prisma = require('../config/database');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// List all projects (admin) or user's projects
router.get('/', authenticateToken, async (req, res) => {
  try {
    const where = req.user.isAdmin ? {} : { userId: req.user.id };
    const projects = await prisma.project.findMany({
      where,
      include: { activities: true, user: { select: { id: true, name: true, email: true, isAdmin: true } } },
      orderBy: { createdAt: 'desc' },
    });
    res.json(projects);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch projects.' });
  }
});

// Get a single project (must own or be admin)
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const project = await prisma.project.findUnique({
      where: { id: req.params.id },
      include: { activities: true, user: { select: { id: true, name: true, email: true } } },
    });
    if (!project) return res.status(404).json({ error: 'Project not found.' });
    if (!req.user.isAdmin && project.userId !== req.user.userId) {
      return res.status(403).json({ error: 'Forbidden.' });
    }
    res.json(project);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch project.' });
  }
});

// Create a project
router.post('/', authenticateToken, async (req, res) => {
  const { title, description, userId, status } = req.body;
  if (!title || !description) return res.status(400).json({ error: 'Title and description required.' });
  try {
    const project = await prisma.project.create({
      data: {
        title,
        description,
        userId: userId,
        status: status || 'OPEN',
      },
    });
    res.status(201).json(project);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create project.' });
  }
});

// Update a project
router.put('/:id', authenticateToken, async (req, res) => {
  const { title, description, status } = req.body;
  try {
    const project = await prisma.project.findUnique({ where: { id: req.params.id } });
    if (!project) return res.status(404).json({ error: 'Project not found.' });
    if (!req.user.isAdmin && project.userId !== req.user.userId) {
      return res.status(403).json({ error: 'Forbidden.' });
    }
    const updated = await prisma.project.update({
      where: { id: req.params.id },
      data: { title, description, status: status || 'OPEN' },
    });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update project.' });
  }
});

// Delete a project
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const project = await prisma.project.findUnique({ where: { id: req.params.id } });
    if (!project) return res.status(404).json({ error: 'Project not found.' });
    if (!req.user.isAdmin && project.userId !== req.user.userId) {
      return res.status(403).json({ error: 'Forbidden.' });
    }
    await prisma.project.delete({ where: { id: req.params.id } });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete project.' });
  }
});

module.exports = router; 