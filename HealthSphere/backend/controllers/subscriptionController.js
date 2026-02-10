import { Subscription } from '../models/SimpleModels.js';
import { SUBSCRIPTION_PLANS } from '../models/Subscription.js';
import { getSubscriptionStatus } from '../middleware/subscription.js';
import { Payment, paymentHelpers, createPaymentRecord, PAYMENT_STATUS, PAYMENT_METHODS } from '../models/Payment.js';
import { Receipt, receiptHelpers, createReceiptRecord } from '../models/Receipt.js';
import QRCode from 'qrcode';
import { v4 as uuidv4 } from 'uuid';

// @desc    Get subscription plans
// @route   GET /api/subscription/plans
// @access  Public
export const getPlans = (req, res) => {
  try {
    res.json({
      plans: Object.values(SUBSCRIPTION_PLANS),
      success: true
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get user's subscription status
// @route   GET /api/subscription/status
// @access  Private
export const getStatus = async (req, res) => {
  try {
    const status = await getSubscriptionStatus(req.user._id);
    res.json(status);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Process card payment
// @route   POST /api/subscription/payment/card
// @access  Private
export const processCardPayment = async (req, res) => {
  try {
    const { planId, duration, cardDetails } = req.body;
    const userId = req.user._id;

    // Validate plan
    const plan = Object.values(SUBSCRIPTION_PLANS).find(p => p.id === planId);
    if (!plan) {
      return res.status(400).json({ message: 'Invalid plan selected' });
    }

    // Validate card details
    const { cardNumber, expiryMonth, expiryYear, cvv, cardholderName } = cardDetails;
    
    if (!paymentHelpers.validateCardNumber(cardNumber)) {
      return res.status(400).json({ message: 'Invalid card number' });
    }
    
    if (!paymentHelpers.validateExpiryDate(expiryMonth, expiryYear)) {
      return res.status(400).json({ message: 'Invalid expiry date' });
    }
    
    if (!paymentHelpers.validateCVV(cvv)) {
      return res.status(400).json({ message: 'Invalid CVV' });
    }

    // Calculate amount based on duration
    const amount = plan.pricing[duration] || plan.price;
    
    // Create payment record
    const paymentData = createPaymentRecord({
      userId,
      planId,
      planName: plan.name,
      amount,
      paymentMethod: PAYMENT_METHODS.CARD,
      paymentDetails: {
        cardLast4: cardNumber.slice(-4),
        cardType: paymentHelpers.getCardType(cardNumber)
      },
      metadata: {
        planDuration: duration,
        planFeatures: plan.featureList,
        userAgent: req.headers['user-agent'],
        ipAddress: req.ip
      }
    });

    // Simulate payment processing (in production, use Stripe/PayPal)
    const paymentSuccess = Math.random() > 0.1; // 90% success rate for demo
    
    if (paymentSuccess) {
      paymentData.status = PAYMENT_STATUS.COMPLETED;
      paymentData.completedAt = new Date().toISOString();
      
      // Save payment
      const payment = Payment.create(paymentData);
      
      // Create receipt
      const receipt = createReceiptRecord(paymentData, req.user, plan);
      Receipt.create(receipt);
      
      // Update user subscription
      await updateUserSubscription(userId, planId, duration, plan);
      
      res.status(201).json({
        success: true,
        message: 'Payment processed successfully',
        payment: {
          id: payment._id,
          transactionId: payment.paymentDetails.transactionId,
          receiptToken: payment.paymentDetails.receiptToken,
          amount: payment.amount,
          status: payment.status
        },
        receipt: {
          receiptNumber: receipt.receiptNumber,
          receiptToken: receipt.receiptToken
        }
      });
    } else {
      paymentData.status = PAYMENT_STATUS.FAILED;
      paymentData.failureReason = 'Payment declined by bank';
      Payment.create(paymentData);
      
      res.status(400).json({
        success: false,
        message: 'Payment failed. Please try again or use a different card.'
      });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Generate QR code for payment
// @route   POST /api/subscription/payment/qr-generate
// @access  Private
export const generateQRPayment = async (req, res) => {
  try {
    const { planId, duration } = req.body;
    const userId = req.user._id;

    // Validate plan
    const plan = Object.values(SUBSCRIPTION_PLANS).find(p => p.id === planId);
    if (!plan) {
      return res.status(400).json({ message: 'Invalid plan selected' });
    }

    // Calculate amount based on duration
    const amount = plan.pricing[duration] || plan.price;
    
    // Create payment record
    const paymentData = createPaymentRecord({
      userId,
      planId,
      planName: plan.name,
      amount,
      paymentMethod: PAYMENT_METHODS.QR_CODE,
      paymentDetails: {
        qrCodeId: uuidv4()
      },
      metadata: {
        planDuration: duration,
        planFeatures: plan.featureList,
        userAgent: req.headers['user-agent'],
        ipAddress: req.ip
      }
    });

    // Save payment record
    const payment = Payment.create(paymentData);

    // Generate QR code data
    const qrData = {
      paymentId: payment._id,
      amount: amount,
      currency: 'USD',
      planName: plan.name,
      merchantId: 'HEALTHSPHERE_DEMO',
      timestamp: new Date().toISOString()
    };

    // Generate QR code image
    const qrCodeDataURL = await QRCode.toDataURL(JSON.stringify(qrData), {
      width: 300,
      margin: 2,
      color: {
        dark: '#000000',
        light: '#FFFFFF'
      }
    });

    res.json({
      success: true,
      qrCode: qrCodeDataURL,
      paymentId: payment._id,
      amount: amount,
      planName: plan.name,
      expiresAt: new Date(Date.now() + 15 * 60 * 1000).toISOString() // 15 minutes
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Confirm QR code payment
// @route   POST /api/subscription/payment/qr-confirm
// @access  Private
export const confirmQRPayment = async (req, res) => {
  try {
    const { paymentId } = req.body;
    const userId = req.user._id;

    // Find payment record
    const payment = Payment.findById(paymentId);
    if (!payment || payment.userId !== userId) {
      return res.status(404).json({ message: 'Payment not found' });
    }

    if (payment.status !== PAYMENT_STATUS.PENDING) {
      return res.status(400).json({ message: 'Payment already processed' });
    }

    // Simulate QR payment confirmation (in production, verify with payment gateway)
    const confirmationSuccess = Math.random() > 0.05; // 95% success rate for demo
    
    if (confirmationSuccess) {
      // Update payment status
      Payment.findByIdAndUpdate(paymentId, {
        status: PAYMENT_STATUS.COMPLETED,
        completedAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });

      // Get updated payment
      const updatedPayment = Payment.findById(paymentId);
      
      // Create receipt
      const plan = Object.values(SUBSCRIPTION_PLANS).find(p => p.id === updatedPayment.planId);
      const receipt = createReceiptRecord(updatedPayment, req.user, plan);
      Receipt.create(receipt);
      
      // Update user subscription
      await updateUserSubscription(userId, updatedPayment.planId, updatedPayment.metadata.planDuration, plan);
      
      res.json({
        success: true,
        message: 'QR payment confirmed successfully',
        payment: {
          id: updatedPayment._id,
          transactionId: updatedPayment.paymentDetails.transactionId,
          receiptToken: updatedPayment.paymentDetails.receiptToken,
          amount: updatedPayment.amount,
          status: updatedPayment.status
        },
        receipt: {
          receiptNumber: receipt.receiptNumber,
          receiptToken: receipt.receiptToken
        }
      });
    } else {
      Payment.findByIdAndUpdate(paymentId, {
        status: PAYMENT_STATUS.FAILED,
        failureReason: 'QR payment verification failed',
        updatedAt: new Date().toISOString()
      });
      
      res.status(400).json({
        success: false,
        message: 'QR payment verification failed. Please try again.'
      });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Helper function to update user subscription
const updateUserSubscription = async (userId, planId, duration, plan) => {
  const now = new Date();
  let expiryDate = new Date(now);
  
  switch (duration) {
    case 'monthly':
      expiryDate.setMonth(expiryDate.getMonth() + 1);
      break;
    case 'quarterly':
      expiryDate.setMonth(expiryDate.getMonth() + 3);
      break;
    case 'yearly':
      expiryDate.setFullYear(expiryDate.getFullYear() + 1);
      break;
    default:
      expiryDate.setMonth(expiryDate.getMonth() + 1);
  }

  // Check if user already has a subscription
  let userSubscription = Subscription.findOne({ userId });

  if (userSubscription) {
    // Update existing subscription
    Subscription.findByIdAndUpdate(userSubscription._id, {
      plan: planId,
      status: 'active',
      startDate: new Date(),
      expiryDate,
      lastPayment: new Date(),
      amount: plan.pricing[duration] || plan.price
    });
  } else {
    // Create new subscription
    Subscription.create({
      userId,
      plan: planId,
      status: 'active',
      startDate: new Date(),
      expiryDate,
      lastPayment: new Date(),
      amount: plan.pricing[duration] || plan.price
    });
  }
};

// @desc    Subscribe to a plan (legacy method for backward compatibility)
// @route   POST /api/subscription/subscribe
// @access  Private
export const subscribe = async (req, res) => {
  try {
    const { planId, paymentMethod } = req.body;
    const userId = req.user._id;

    // Validate plan
    const plan = Object.values(SUBSCRIPTION_PLANS).find(p => p.id === planId);
    if (!plan) {
      return res.status(400).json({ message: 'Invalid plan selected' });
    }

    // For demo purposes, we'll simulate payment processing
    // In production, integrate with Stripe, PayPal, etc.
    
    // Calculate expiry date
    const now = new Date();
    const expiryDate = new Date(now.setMonth(now.getMonth() + 1)); // 1 month from now

    // Check if user already has a subscription
    let userSubscription = Subscription.findOne({ userId });

    if (userSubscription) {
      // Update existing subscription
      Subscription.findByIdAndUpdate(userSubscription._id, {
        plan: planId,
        status: 'active',
        startDate: new Date(),
        expiryDate,
        paymentMethod,
        lastPayment: new Date(),
        amount: plan.price
      });
    } else {
      // Create new subscription
      userSubscription = Subscription.create({
        userId,
        plan: planId,
        status: 'active',
        startDate: new Date(),
        expiryDate,
        paymentMethod,
        lastPayment: new Date(),
        amount: plan.price
      });
    }

    res.status(201).json({
      message: `Successfully subscribed to ${plan.name} plan`,
      subscription: userSubscription,
      plan
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Cancel subscription
// @route   DELETE /api/subscription/cancel
// @access  Private
export const cancelSubscription = async (req, res) => {
  try {
    const userId = req.user._id;
    
    const userSubscription = Subscription.findOne({ userId });
    
    if (!userSubscription) {
      return res.status(404).json({ message: 'No active subscription found' });
    }

    // Update subscription status to cancelled
    Subscription.findByIdAndUpdate(userSubscription._id, {
      status: 'cancelled',
      cancelledAt: new Date()
    });

    res.json({
      message: 'Subscription cancelled successfully',
      note: 'You can continue using premium features until your current billing period ends'
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get payment history
// @route   GET /api/subscription/history
// @access  Private
export const getHistory = async (req, res) => {
  try {
    const userId = req.user._id;
    
    // Get payment history
    const payments = Payment.find({ userId }).sort({ createdAt: -1 });
    
    // Get current subscription
    const subscription = Subscription.findOne({ userId });
    
    const history = payments.map(payment => ({
      id: payment._id,
      date: payment.createdAt,
      amount: payment.amount,
      currency: payment.currency,
      plan: payment.planName,
      status: payment.status,
      paymentMethod: payment.paymentMethod,
      transactionId: payment.paymentDetails.transactionId,
      receiptToken: payment.paymentDetails.receiptToken
    }));

    res.json({
      success: true,
      history,
      currentSubscription: subscription,
      totalPayments: payments.length
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get user receipts
// @route   GET /api/subscription/receipts
// @access  Private
export const getReceipts = async (req, res) => {
  try {
    const userId = req.user._id;
    const { page = 1, limit = 10 } = req.query;
    
    // Get receipts for user
    const receipts = Receipt.find({ userId })
      .sort({ createdAt: -1 })
      .slice((page - 1) * limit, page * limit);
    
    const totalReceipts = Receipt.find({ userId }).length;
    
    const formattedReceipts = receipts.map(receipt => ({
      id: receipt._id,
      receiptNumber: receipt.receiptNumber,
      receiptToken: receipt.receiptToken,
      planName: receipt.subscriptionDetails.planName,
      amount: receiptHelpers.formatCurrency(receipt.paymentInfo.amount),
      paymentMethod: receipt.paymentInfo.methodDisplay,
      date: receiptHelpers.formatReceiptDate(receipt.createdAt),
      status: receipt.status,
      downloadCount: receipt.downloadCount
    }));

    res.json({
      success: true,
      receipts: formattedReceipts,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(totalReceipts / limit),
        totalReceipts,
        hasNext: page * limit < totalReceipts,
        hasPrev: page > 1
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get receipt details
// @route   GET /api/subscription/receipt/:receiptToken
// @access  Private
export const getReceiptDetails = async (req, res) => {
  try {
    const { receiptToken } = req.params;
    const userId = req.user._id;
    
    // Find receipt by token and user
    const receipt = Receipt.findOne({ receiptToken, userId });
    
    if (!receipt) {
      return res.status(404).json({ 
        success: false, 
        message: 'Receipt not found' 
      });
    }
    
    // Increment download count
    Receipt.findByIdAndUpdate(receipt._id, {
      downloadCount: receipt.downloadCount + 1,
      updatedAt: new Date().toISOString()
    });
    
    // Generate receipt data for display/PDF
    const receiptData = receiptHelpers.generateReceiptData(receipt);
    
    res.json({
      success: true,
      receipt: receiptData
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Download receipt as JSON (for PDF generation in frontend)
// @route   GET /api/subscription/receipt/:receiptToken/download
// @access  Private
export const downloadReceipt = async (req, res) => {
  try {
    const { receiptToken } = req.params;
    const userId = req.user._id;
    
    // Find receipt by token and user
    const receipt = Receipt.findOne({ receiptToken, userId });
    
    if (!receipt) {
      return res.status(404).json({ 
        success: false, 
        message: 'Receipt not found' 
      });
    }
    
    // Generate receipt data
    const receiptData = receiptHelpers.generateReceiptData(receipt);
    
    // Set headers for download
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Content-Disposition', `attachment; filename="receipt-${receipt.receiptNumber}.json"`);
    
    res.json(receiptData);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Verify receipt token
// @route   POST /api/subscription/receipt/verify
// @access  Public
export const verifyReceipt = async (req, res) => {
  try {
    const { receiptToken } = req.body;
    
    if (!receiptToken) {
      return res.status(400).json({ 
        success: false, 
        message: 'Receipt token is required' 
      });
    }
    
    // Find receipt by token
    const receipt = Receipt.findOne({ receiptToken });
    
    if (!receipt) {
      return res.status(404).json({ 
        success: false, 
        message: 'Invalid receipt token' 
      });
    }
    
    res.json({
      success: true,
      valid: true,
      receipt: {
        receiptNumber: receipt.receiptNumber,
        planName: receipt.subscriptionDetails.planName,
        amount: receiptHelpers.formatCurrency(receipt.paymentInfo.amount),
        date: receiptHelpers.formatReceiptDate(receipt.createdAt),
        customerName: receipt.customerInfo.name,
        status: receipt.status
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Upgrade/Downgrade subscription
// @route   PUT /api/subscription/change-plan
// @access  Private
export const changePlan = async (req, res) => {
  try {
    const { newPlanId } = req.body;
    const userId = req.user._id;

    const newPlan = Object.values(SUBSCRIPTION_PLANS).find(p => p.id === newPlanId);
    if (!newPlan) {
      return res.status(400).json({ message: 'Invalid plan selected' });
    }

    const userSubscription = Subscription.findOne({ userId });
    
    if (!userSubscription) {
      return res.status(404).json({ message: 'No subscription found' });
    }

    // Update subscription plan
    Subscription.findByIdAndUpdate(userSubscription._id, {
      plan: newPlanId,
      amount: newPlan.price,
      lastModified: new Date()
    });

    res.json({
      message: `Plan changed to ${newPlan.name} successfully`,
      newPlan
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
