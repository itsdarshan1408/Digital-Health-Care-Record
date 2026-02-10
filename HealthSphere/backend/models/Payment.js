import { createModel } from '../utils/localStorage.js';

// Payment model for local storage
export const Payment = createModel('payments');

// Payment status constants
export const PAYMENT_STATUS = {
  PENDING: 'pending',
  PROCESSING: 'processing',
  COMPLETED: 'completed',
  FAILED: 'failed',
  CANCELLED: 'cancelled',
  REFUNDED: 'refunded'
};

// Payment method constants
export const PAYMENT_METHODS = {
  CARD: 'card',
  QR_CODE: 'qr_code',
  DEMO: 'demo'
};

// Payment helper functions
export const paymentHelpers = {
  // Generate unique payment ID
  generatePaymentId: () => {
    const timestamp = Date.now().toString(36);
    const random = Math.random().toString(36).substr(2, 5);
    return `pay_${timestamp}_${random}`.toUpperCase();
  },

  // Generate unique transaction ID
  generateTransactionId: () => {
    const timestamp = Date.now().toString(36);
    const random = Math.random().toString(36).substr(2, 8);
    return `txn_${timestamp}_${random}`.toUpperCase();
  },

  // Generate receipt token
  generateReceiptToken: () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    for (let i = 0; i < 12; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  },

  // Validate card number (basic Luhn algorithm)
  validateCardNumber: (cardNumber) => {
    const num = cardNumber.replace(/\s/g, '');
    if (!/^\d{13,19}$/.test(num)) return false;
    
    let sum = 0;
    let isEven = false;
    
    for (let i = num.length - 1; i >= 0; i--) {
      let digit = parseInt(num[i]);
      
      if (isEven) {
        digit *= 2;
        if (digit > 9) digit -= 9;
      }
      
      sum += digit;
      isEven = !isEven;
    }
    
    return sum % 10 === 0;
  },

  // Validate expiry date
  validateExpiryDate: (month, year) => {
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth() + 1;
    
    const expMonth = parseInt(month);
    const expYear = parseInt(year);
    
    if (expMonth < 1 || expMonth > 12) return false;
    if (expYear < currentYear) return false;
    if (expYear === currentYear && expMonth < currentMonth) return false;
    
    return true;
  },

  // Validate CVV
  validateCVV: (cvv) => {
    return /^\d{3,4}$/.test(cvv);
  },

  // Mask card number for display
  maskCardNumber: (cardNumber) => {
    const num = cardNumber.replace(/\s/g, '');
    return `****-****-****-${num.slice(-4)}`;
  },

  // Get card type from number
  getCardType: (cardNumber) => {
    const num = cardNumber.replace(/\s/g, '');
    
    if (/^4/.test(num)) return 'Visa';
    if (/^5[1-5]/.test(num)) return 'Mastercard';
    if (/^3[47]/.test(num)) return 'American Express';
    if (/^6/.test(num)) return 'Discover';
    
    return 'Unknown';
  },

  // Calculate processing fee (if any)
  calculateProcessingFee: (amount, paymentMethod) => {
    if (paymentMethod === PAYMENT_METHODS.QR_CODE) return 0;
    if (paymentMethod === PAYMENT_METHODS.DEMO) return 0;
    
    // 2.9% + $0.30 for card payments (typical Stripe fee)
    return Math.round((amount * 0.029 + 0.30) * 100) / 100;
  }
};

// Default payment schema structure
export const createPaymentRecord = (data) => ({
  _id: paymentHelpers.generatePaymentId(),
  userId: data.userId,
  planId: data.planId,
  planName: data.planName,
  amount: data.amount,
  currency: data.currency || 'INR',
  paymentMethod: data.paymentMethod,
  paymentDetails: {
    // For card payments
    cardLast4: data.paymentDetails?.cardLast4,
    cardType: data.paymentDetails?.cardType,
    // For QR payments
    qrCodeId: data.paymentDetails?.qrCodeId,
    // Common fields
    transactionId: paymentHelpers.generateTransactionId(),
    receiptToken: paymentHelpers.generateReceiptToken()
  },
  status: data.status || PAYMENT_STATUS.PENDING,
  processingFee: paymentHelpers.calculateProcessingFee(data.amount, data.paymentMethod),
  metadata: {
    userAgent: data.metadata?.userAgent,
    ipAddress: data.metadata?.ipAddress,
    planDuration: data.metadata?.planDuration,
    planFeatures: data.metadata?.planFeatures
  },
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  completedAt: null,
  failureReason: null
});
