import { Subscription, UsageTracking } from '../models/SimpleModels.js';
import { SUBSCRIPTION_PLANS, subscriptionHelpers } from '../models/Subscription.js';

// Middleware to check subscription access
export const requireSubscription = (requiredPlan) => {
  return async (req, res, next) => {
    try {
      const userId = req.user._id;
      
      // Get user's subscription
      const userSubscription = Subscription.findOne({ userId });
      
      // Check if subscription is active
      if (!subscriptionHelpers.isActive(userSubscription)) {
        return res.status(403).json({
          message: 'Subscription required',
          requiredPlan,
          currentPlan: 'free'
        });
      }

      // Check if user has required plan level
      const planHierarchy = { free: 0, premium: 1, pro: 2 };
      const userPlanLevel = planHierarchy[userSubscription?.plan || 'free'];
      const requiredPlanLevel = planHierarchy[requiredPlan];

      if (userPlanLevel < requiredPlanLevel) {
        return res.status(403).json({
          message: `${requiredPlan} subscription required`,
          requiredPlan,
          currentPlan: userSubscription?.plan || 'free'
        });
      }

      req.userSubscription = userSubscription;
      next();
    } catch (error) {
      res.status(500).json({ message: 'Subscription check failed' });
    }
  };
};

// Middleware to check feature access
export const checkFeatureAccess = (feature) => {
  return async (req, res, next) => {
    try {
      const userId = req.user._id;
      const userSubscription = Subscription.findOne({ userId });

      if (!subscriptionHelpers.hasAccess(userSubscription, feature)) {
        return res.status(403).json({
          message: `Feature '${feature}' requires subscription upgrade`,
          feature,
          currentPlan: userSubscription?.plan || 'free'
        });
      }

      req.userSubscription = userSubscription;
      next();
    } catch (error) {
      res.status(500).json({ message: 'Feature access check failed' });
    }
  };
};

// Middleware to check usage limits
export const checkUsageLimit = (limitType) => {
  return async (req, res, next) => {
    try {
      const userId = req.user._id;
      const userSubscription = Subscription.findOne({ userId });
      
      // Get current month's usage
      const currentMonth = new Date().toISOString().slice(0, 7); // YYYY-MM
      const usage = UsageTracking.findOne({ 
        userId, 
        month: currentMonth 
      }) || { [limitType]: 0 };

      const currentUsage = usage[limitType] || 0;

      if (!subscriptionHelpers.checkLimit(userSubscription, limitType, currentUsage)) {
        const remaining = subscriptionHelpers.getRemainingUsage(userSubscription, limitType, currentUsage);
        return res.status(403).json({
          message: `Usage limit reached for ${limitType}`,
          currentUsage,
          remaining,
          upgradeRequired: true
        });
      }

      req.userSubscription = userSubscription;
      req.currentUsage = currentUsage;
      next();
    } catch (error) {
      res.status(500).json({ message: 'Usage limit check failed' });
    }
  };
};

// Helper to track usage
export const trackUsage = async (userId, limitType) => {
  try {
    const currentMonth = new Date().toISOString().slice(0, 7);
    
    let usage = UsageTracking.findOne({ userId, month: currentMonth });
    
    if (!usage) {
      usage = UsageTracking.create({
        userId,
        month: currentMonth,
        [limitType]: 1
      });
    } else {
      const newCount = (usage[limitType] || 0) + 1;
      UsageTracking.findByIdAndUpdate(usage._id, {
        [limitType]: newCount
      });
    }
  } catch (error) {
    console.error('Usage tracking error:', error);
  }
};

// Get user's subscription status
export const getSubscriptionStatus = async (userId) => {
  try {
    const userSubscription = Subscription.findOne({ userId });
    const currentMonth = new Date().toISOString().slice(0, 7);
    const usage = UsageTracking.findOne({ userId, month: currentMonth }) || {};

    const plan = SUBSCRIPTION_PLANS[userSubscription?.plan?.toUpperCase()] || SUBSCRIPTION_PLANS.FREE;

    return {
      plan: userSubscription?.plan || 'free',
      isActive: subscriptionHelpers.isActive(userSubscription),
      expiryDate: userSubscription?.expiryDate,
      features: plan.features,
      limits: plan.limits,
      currentUsage: usage,
      remaining: {
        healthRecords: subscriptionHelpers.getRemainingUsage(userSubscription, 'healthRecordsMax', usage.healthRecords || 0),
        fitnessEntries: subscriptionHelpers.getRemainingUsage(userSubscription, 'fitnessEntriesPerMonth', usage.fitnessEntries || 0),
        dietPlans: subscriptionHelpers.getRemainingUsage(userSubscription, 'dietPlansPerMonth', usage.dietPlans || 0),
        aiMessages: subscriptionHelpers.getRemainingUsage(userSubscription, 'aiMessagesPerMonth', usage.aiMessages || 0),
      }
    };
  } catch (error) {
    console.error('Get subscription status error:', error);
    return null;
  }
};
