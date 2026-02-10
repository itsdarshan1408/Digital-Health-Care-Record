import { createModel } from '../utils/localStorage.js';

// Subscription model for local storage
export const Subscription = createModel('subscriptions');

// Subscription plans configuration
export const SUBSCRIPTION_PLANS = {
  FREE: {
    id: 'free',
    name: 'Free Plan',
    description: 'Perfect for getting started with basic health tracking',
    price: 0,
    interval: 'month',
    popular: false,
    pricing: {
      monthly: 0,
      quarterly: 0,
      yearly: 0
    },
    features: {
      healthRecords: 5,
      fitnessEntries: 10, // per month
      dietPlans: 5, // per month
      aiMessages: 0,
      communityAccess: 'read',
      emailReminders: false,
      advancedAnalytics: false,
      dataExport: false,
      prioritySupport: false,
      customGoals: false,
      telemedicine: false
    },
    limits: {
      healthRecordsMax: 5,
      fitnessEntriesPerMonth: 10,
      dietPlansPerMonth: 5,
      aiMessagesPerMonth: 0,
    },
    featureList: [
      'Up to 5 health records',
      '10 fitness entries per month',
      '5 diet plans per month',
      'Read-only community access',
      'Basic health dashboard',
      'Standard support'
    ]
  },
  
  STANDARD: {
    id: 'standard',
    name: 'Standard Plan',
    description: 'Great for regular health monitoring and fitness tracking',
    price: 9.99,
    interval: 'month',
    popular: false,
    pricing: {
      monthly: 9.99,
      quarterly: 26.97, // 10% discount
      yearly: 95.90 // 20% discount
    },
    features: {
      healthRecords: 50,
      fitnessEntries: 'unlimited',
      dietPlans: 'unlimited',
      aiMessages: 25, // per month
      communityAccess: 'full',
      emailReminders: true,
      advancedAnalytics: false,
      dataExport: false,
      prioritySupport: false,
      customGoals: true,
      telemedicine: false
    },
    limits: {
      healthRecordsMax: 50,
      fitnessEntriesPerMonth: -1,
      dietPlansPerMonth: -1,
      aiMessagesPerMonth: 25,
    },
    featureList: [
      'Up to 50 health records',
      'Unlimited fitness tracking',
      'Unlimited diet plans',
      '25 AI coaching messages/month',
      'Full community access',
      'Email reminders',
      'Custom fitness goals',
      'Standard support'
    ]
  },
  
  PREMIUM: {
    id: 'premium',
    name: 'Premium Plan',
    description: 'Most popular choice for comprehensive health management',
    price: 19.99,
    interval: 'month',
    popular: true,
    pricing: {
      monthly: 19.99,
      quarterly: 53.97, // 10% discount
      yearly: 191.90 // 20% discount
    },
    features: {
      healthRecords: 'unlimited',
      fitnessEntries: 'unlimited',
      dietPlans: 'unlimited',
      aiMessages: 100, // per month
      communityAccess: 'full',
      emailReminders: true,
      advancedAnalytics: true,
      dataExport: true,
      prioritySupport: true,
      customGoals: true,
      telemedicine: true
    },
    limits: {
      healthRecordsMax: -1, // unlimited
      fitnessEntriesPerMonth: -1,
      dietPlansPerMonth: -1,
      aiMessagesPerMonth: 100,
    },
    featureList: [
      'Unlimited health records',
      'Unlimited fitness tracking',
      'Unlimited diet plans',
      '100 AI coaching messages/month',
      'Full community access',
      'Advanced analytics & insights',
      'Data export capabilities',
      'Priority customer support',
      'Custom health goals',
      'Telemedicine consultations',
      'Email & SMS reminders'
    ]
  }
};

// Helper functions for subscription management
export const subscriptionHelpers = {
  // Check if user has access to a feature
  hasAccess: (userSubscription, feature) => {
    const plan = SUBSCRIPTION_PLANS[userSubscription?.plan?.toUpperCase()] || SUBSCRIPTION_PLANS.FREE;
    return plan.features[feature];
  },

  // Check usage limits
  checkLimit: (userSubscription, limitType, currentUsage) => {
    const plan = SUBSCRIPTION_PLANS[userSubscription?.plan?.toUpperCase()] || SUBSCRIPTION_PLANS.FREE;
    const limit = plan.limits[limitType];
    
    if (limit === -1) return true; // unlimited
    return currentUsage < limit;
  },

  // Get remaining usage
  getRemainingUsage: (userSubscription, limitType, currentUsage) => {
    const plan = SUBSCRIPTION_PLANS[userSubscription?.plan?.toUpperCase()] || SUBSCRIPTION_PLANS.FREE;
    const limit = plan.limits[limitType];
    
    if (limit === -1) return 'unlimited';
    return Math.max(0, limit - currentUsage);
  },

  // Check if subscription is active
  isActive: (userSubscription) => {
    if (!userSubscription) return false;
    if (userSubscription.plan === 'free') return true;
    
    const now = new Date();
    const expiryDate = new Date(userSubscription.expiryDate);
    return now <= expiryDate;
  }
};
