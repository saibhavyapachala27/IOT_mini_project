import express from 'express';
import HelpRequest from '../models/HelpRequest.js';
import { authMiddleware } from './auth.js';

const router = express.Router();

// Submit a help request
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { subject, message } = req.body;
    const newRequest = await HelpRequest.create({
      studentId: req.user.id,
      subject,
      message
    });
    res.status(201).json(newRequest);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

export default router;
