import express from 'express';
import {
  getPlans,
  getStatus,
  subscribe,
  cancelSubscription,
  getHistory,
  changePlan,
  processCardPayment,
  generateQRPayment,
  confirmQRPayment,
  getReceipts,
  getReceiptDetails,
  downloadReceipt,
  verifyReceipt
} from '../controllers/subscriptionController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// Public routes
router.get('/plans', getPlans);
router.post('/receipt/verify', verifyReceipt);

// Protected routes
router.get('/status', protect, getStatus);
router.get('/history', protect, getHistory);
router.get('/receipts', protect, getReceipts);
router.get('/receipt/:receiptToken', protect, getReceiptDetails);
router.get('/receipt/:receiptToken/download', protect, downloadReceipt);

// Payment routes
router.post('/payment/card', protect, processCardPayment);
router.post('/payment/qr-generate', protect, generateQRPayment);
router.post('/payment/qr-confirm', protect, confirmQRPayment);

// Legacy routes (for backward compatibility)
router.post('/subscribe', protect, subscribe);
router.put('/change-plan', protect, changePlan);
router.delete('/cancel', protect, cancelSubscription);

export default router;
