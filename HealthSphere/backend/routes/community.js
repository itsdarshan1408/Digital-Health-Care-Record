import express from 'express';
import { simpleControllers } from '../controllers/simpleControllers.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// Posts routes
router.route('/posts')
  .get(protect, simpleControllers.getPosts)
  .post(protect, simpleControllers.createPost);

// Challenges routes
router.route('/challenges')
  .get(protect, simpleControllers.getChallenges);

export default router;
