import express from 'express';
import { Review, User, Project } from '../models/index.js';
import { authMiddleware } from './auth.js';

const router = express.Router({ mergeParams: true });

// Get all reviews for a project
router.get('/', async (req, res) => {
  try {
    const { projectId } = req.params;
    const reviews = await Review.findAll({
      where: { projectId },
      include: [{ model: User, attributes: ['name', 'profilePicture', 'department'] }],
      order: [['createdAt', 'DESC']]
    });
    res.json(reviews);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Submit a new review
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { projectId } = req.params;
    const { rating, comment } = req.body;

    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({ error: 'Rating must be between 1 and 5' });
    }

    const project = await Project.findByPk(projectId);
    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    if (project.studentId === req.user.id) {
      return res.status(400).json({ error: 'You cannot review your own project' });
    }

    // Check if the user has already reviewed this project
    const existing = await Review.findOne({ where: { projectId, studentId: req.user.id } });
    if (existing) {
      return res.status(400).json({ error: 'You have already reviewed this project' });
    }

    const newReview = await Review.create({
      rating,
      comment,
      projectId,
      studentId: req.user.id
    });

    const populatedReview = await Review.findByPk(newReview.id, {
      include: [{ model: User, attributes: ['name', 'profilePicture', 'department'] }]
    });

    res.status(201).json(populatedReview);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

export default router;
