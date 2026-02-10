import { createModel } from '../utils/localStorage.js';

// Receipt model for local storage
export const Receipt = createModel('receipts');

// Receipt helper functions
export const receiptHelpers = {
  // Generate receipt number
  generateReceiptNumber: () => {
    const date = new Date();
    const year = date.getFullYear().toString().slice(-2);
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    const random = Math.floor(Math.random() * 9999).toString().padStart(4, '0');
    
    return `RCP-${year}${month}${day}-${random}`;
  },

  // Format currency
  formatCurrency: (amount, currency = 'INR') => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency
    }).format(amount);
  },

  // Format date for receipt
  formatReceiptDate: (date) => {
    return new Date(date).toLocaleString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      timeZoneName: 'short'
    });
  },

  // Calculate plan expiry date
  calculateExpiryDate: (startDate, planDuration) => {
    const start = new Date(startDate);
    const expiry = new Date(start);
    
    switch (planDuration) {
      case 'monthly':
        expiry.setMonth(expiry.getMonth() + 1);
        break;
      case 'quarterly':
        expiry.setMonth(expiry.getMonth() + 3);
        break;
      case 'yearly':
        expiry.setFullYear(expiry.getFullYear() + 1);
        break;
      default:
        expiry.setMonth(expiry.getMonth() + 1);
    }
    
    return expiry.toISOString();
  },

  // Generate receipt PDF data (for future PDF generation)
  generateReceiptData: (receipt) => ({
    receiptNumber: receipt.receiptNumber,
    receiptToken: receipt.receiptToken,
    issueDate: receiptHelpers.formatReceiptDate(receipt.createdAt),
    customer: {
      name: receipt.customerInfo.name,
      email: receipt.customerInfo.email,
      userId: receipt.customerInfo.userId
    },
    subscription: {
      planName: receipt.subscriptionDetails.planName,
      planId: receipt.subscriptionDetails.planId,
      duration: receipt.subscriptionDetails.duration,
      startDate: receiptHelpers.formatReceiptDate(receipt.subscriptionDetails.startDate),
      expiryDate: receiptHelpers.formatReceiptDate(receipt.subscriptionDetails.expiryDate),
      features: receipt.subscriptionDetails.features
    },
    payment: {
      method: receipt.paymentInfo.method,
      amount: receiptHelpers.formatCurrency(receipt.paymentInfo.amount),
      currency: receipt.paymentInfo.currency,
      transactionId: receipt.paymentInfo.transactionId,
      processingFee: receiptHelpers.formatCurrency(receipt.paymentInfo.processingFee || 0),
      totalAmount: receiptHelpers.formatCurrency(
        receipt.paymentInfo.amount + (receipt.paymentInfo.processingFee || 0)
      )
    },
    company: {
      name: 'Digital Health Care System',
      address: 'Health Technology Solutions',
      email: 'support@healthsphere.com',
      website: 'https://healthsphere.com'
    }
  })
};

// Default receipt schema structure
export const createReceiptRecord = (paymentData, userInfo, subscriptionInfo) => ({
  _id: receiptHelpers.generateReceiptNumber(),
  receiptNumber: receiptHelpers.generateReceiptNumber(),
  receiptToken: paymentData.paymentDetails.receiptToken,
  paymentId: paymentData._id,
  userId: paymentData.userId,
  
  // Customer information
  customerInfo: {
    userId: userInfo._id,
    name: userInfo.name,
    email: userInfo.email
  },
  
  // Subscription details
  subscriptionDetails: {
    planId: paymentData.planId,
    planName: paymentData.planName,
    duration: paymentData.metadata?.planDuration || 'monthly',
    startDate: new Date().toISOString(),
    expiryDate: receiptHelpers.calculateExpiryDate(
      new Date().toISOString(), 
      paymentData.metadata?.planDuration || 'monthly'
    ),
    features: paymentData.metadata?.planFeatures || []
  },
  
  // Payment information
  paymentInfo: {
    method: paymentData.paymentMethod,
    methodDisplay: paymentData.paymentMethod === 'card' 
      ? `Card ending in ${paymentData.paymentDetails.cardLast4}` 
      : paymentData.paymentMethod === 'qr_code' 
      ? 'QR Code Payment' 
      : 'Demo Payment',
    amount: paymentData.amount,
    currency: paymentData.currency,
    processingFee: paymentData.processingFee,
    totalAmount: paymentData.amount + (paymentData.processingFee || 0),
    transactionId: paymentData.paymentDetails.transactionId,
    cardType: paymentData.paymentDetails?.cardType,
    cardLast4: paymentData.paymentDetails?.cardLast4
  },
  
  // Receipt metadata
  status: 'issued',
  downloadCount: 0,
  emailSent: false,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString()
});
