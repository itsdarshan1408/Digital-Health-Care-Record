import express from 'express';
import { simpleControllers } from '../controllers/simpleControllers.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.route('/')
  .get(protect, simpleControllers.getDietPlans)
  .post(protect, simpleControllers.createDietPlan);

router.get('/stats', protect, simpleControllers.getDietStats);

export default router;
