import express from 'express';
import { simpleControllers } from '../controllers/simpleControllers.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.route('/')
  .get(protect, simpleControllers.getProfile)
  .put(protect, simpleControllers.updateProfile);
export default router;
