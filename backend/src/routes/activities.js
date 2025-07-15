const express = require('express');
const prisma = require('../config/database');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// List activities for a project (must own or be admin)
router.get('/project/:projectId', authenticateToken, async (req, res) => {
  try {
    const project = await prisma.project.findUnique({ where: { id: req.params.projectId } });
    if (!project) return res.status(404).json({ error: 'Project not found.' });
    if (!req.user.isAdmin && project.userId !== req.user.userId) {
      return res.status(403).json({ error: 'Forbidden.' });
    }
    const activities = await prisma.activity.findMany({
      where: { projectId: req.params.projectId },
      orderBy: { startTime: 'desc' },
    });
    res.json(activities);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch activities.' });
  }
});

// Create an activity for a project
router.post('/project/:projectId', authenticateToken, async (req, res) => {
  const { type, description, status, hoursWorked, startTime, endTime, hourRate } = req.body;
  if (!type || !description || !status) {
    return res.status(400).json({ error: 'Type, description and status fields are required.' });
  }
  try {
    const project = await prisma.project.findUnique({ where: { id: req.params.projectId } });
    if (!project) return res.status(404).json({ error: 'Project not found.' });
    if (!req.user.isAdmin && project.userId !== req.user.userId) {
      return res.status(403).json({ error: 'Forbidden.' });
    }
    const totalCost = (parseFloat(hoursWorked) || 0) * (parseFloat(hourRate) || 8000);
    const activity = await prisma.activity.create({
      data: {
        type,
        description,
        status,
        hoursWorked: parseFloat(hoursWorked),
        startTime: new Date(startTime),
        endTime: new Date(endTime),
        hourRate: parseFloat(hourRate) || 8000,
        totalCost,
        projectId: req.params.projectId,
      },
    });
    res.status(201).json(activity);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create activity.' });
  }
});

// Update an activity
router.put('/:id', authenticateToken, async (req, res) => {
  const { type, description, status, hoursWorked, startTime, endTime, hourRate } = req.body;
  try {
    const activity = await prisma.activity.findUnique({ where: { id: req.params.id }, include: { project: true } });
    if (!activity) return res.status(404).json({ error: 'Activity not found.' });
    if (!req.user.isAdmin && activity.project.userId !== req.user.userId) {
      return res.status(403).json({ error: 'Forbidden.' });
    }
    const totalCost = (parseFloat(hoursWorked) || 0) * (parseFloat(hourRate) || 8000);
    const updated = await prisma.activity.update({
      where: { id: req.params.id },
      data: {
        type,
        description,
        status,
        hoursWorked: parseFloat(hoursWorked),
        startTime: new Date(startTime),
        endTime: new Date(endTime),
        hourRate: parseFloat(hourRate) || 8000,
        totalCost,
      },
    });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update activity.' });
  }
});

// Delete an activity
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const activity = await prisma.activity.findUnique({ where: { id: req.params.id }, include: { project: true } });
    if (!activity) return res.status(404).json({ error: 'Activity not found.' });
    if (!req.user.isAdmin && activity.project.userId !== req.user.userId) {
      return res.status(403).json({ error: 'Forbidden.' });
    }
    await prisma.activity.delete({ where: { id: req.params.id } });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete activity.' });
  }
});

module.exports = router; 