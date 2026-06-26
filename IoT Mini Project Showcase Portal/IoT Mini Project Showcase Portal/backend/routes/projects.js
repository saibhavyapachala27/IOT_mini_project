import express from 'express';
import Project from '../models/Project.js';
import { authMiddleware } from './auth.js';

const router = express.Router();

// Get all approved projects for public showcase
router.get('/', async (req, res) => {
  try {
    const projects = await Project.findAll({
      where: { status: 'Approved' },
      order: [['createdAt', 'DESC']]
    });
    res.json(projects);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get user's own projects
router.get('/my-projects', authMiddleware, async (req, res) => {
  try {
    const projects = await Project.findAll({
      where: { studentId: req.user.id },
      order: [['createdAt', 'DESC']]
    });
    res.json(projects);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Submit a new project
router.post('/', authMiddleware, async (req, res) => {
  try {
    const newProject = await Project.create({
      ...req.body,
      studentId: req.user.id,
      status: 'Pending'
    });
    res.status(201).json(newProject);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Update an existing project (only if own project)
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const project = await Project.findOne({ 
      where: { id: req.params.id, studentId: req.user.id } 
    });
    if (!project) return res.status(404).json({ error: 'Project not found' });
    
    const updates = req.body;
    await project.update({
      ...updates,
      status: 'Pending', // Reset status back to Pending for review
      rejectionReason: null,
      rejectedAt: null
    });

    res.json(project);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Delete an existing project (only if own project)
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const deletedCount = await Project.destroy({
      where: { id: req.params.id, studentId: req.user.id }
    });
    if (deletedCount === 0) return res.status(404).json({ error: 'Project not found' });
    res.json({ message: 'Project deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
