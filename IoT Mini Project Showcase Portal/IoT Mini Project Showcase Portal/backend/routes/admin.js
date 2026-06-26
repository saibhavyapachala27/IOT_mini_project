import express from 'express';
import Project from '../models/Project.js';
import User from '../models/User.js';
import { authMiddleware, adminMiddleware } from './auth.js';

import bcrypt from 'bcryptjs';

const router = express.Router();

router.use(authMiddleware, adminMiddleware);

// Get all projects for admin review
router.get('/projects', async (req, res) => {
  try {
    const projects = await Project.findAll({
      order: [['createdAt', 'DESC']]
    });
    res.json(projects);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update project status
router.put('/projects/:id/status', async (req, res) => {
  try {
    const { status, rejectionReason } = req.body;
    if (!['Pending', 'Under Review', 'Approved', 'Rejected'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }

    const updates = { status };
    if (status === 'Rejected') {
      updates.rejectionReason = rejectionReason || 'No reason provided';
      updates.rejectedAt = new Date();
    }

    const project = await Project.findByPk(req.params.id);
    if (!project) return res.status(404).json({ error: 'Project not found' });
    
    await project.update(updates);
    res.json(project);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get all users
router.get('/users', async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: { exclude: ['password'] },
      order: [['createdAt', 'DESC']]
    });
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Create a new user (student)
router.post('/users', async (req, res) => {
  try {
    const { name, email, password, department, role } = req.body;
    
    let existing = await User.findOne({ where: { email } });
    if (existing) return res.status(400).json({ error: 'Email already in use' });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password || 'Password123', salt);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      department,
      role: role || 'Member',
      isVerified: true
    });

    const userResponse = user.toJSON();
    delete userResponse.password;
    res.status(201).json(userResponse);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Update a user (edit details / reassign department)
router.put('/users/:id', async (req, res) => {
  try {
    const { name, email, department, role } = req.body;
    const user = await User.findByPk(req.params.id);
    if (!user) return res.status(404).json({ error: 'User not found' });

    await user.update({ name, email, department, role });
    
    const userResponse = user.toJSON();
    delete userResponse.password;
    res.json(userResponse);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Delete a user
router.delete('/users/:id', async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) return res.status(404).json({ error: 'User not found' });

    await user.destroy();
    res.json({ message: 'User deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
