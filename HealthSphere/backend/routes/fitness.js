import express from 'express';
import { simpleControllers } from '../controllers/simpleControllers.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.route('/')
  .get(protect, simpleControllers.getFitnessEntries)
  .post(protect, simpleControllers.createFitnessEntry);

router.get('/stats', protect, simpleControllers.getFitnessStats);

export default router;
