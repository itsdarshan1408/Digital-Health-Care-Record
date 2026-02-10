import express from 'express';
import { simpleControllers } from '../controllers/simpleControllers.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.post('/coach', protect, simpleControllers.sendMessage);
router.get('/history', protect, simpleControllers.getChatHistory);
router.delete('/history', protect, simpleControllers.clearChatHistory);

export default router;
