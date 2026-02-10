import { User, HealthRecord, FitnessEntry, DietPlan, Message, Post, Challenge, Reminder } from '../models/SimpleModels.js';
import bcrypt from 'bcryptjs';

// Simple controllers that work with local storage
export const simpleControllers = {
  // Fitness
  getFitnessEntries: (req, res) => {
    try {
      const entries = FitnessEntry.find({ userId: req.user._id });
      res.json(entries);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  createFitnessEntry: (req, res) => {
    try {
      const entry = FitnessEntry.create({
        userId: req.user._id,
        ...req.body,
      });
      res.status(201).json(entry);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  getFitnessStats: (req, res) => {
    try {
      const entries = FitnessEntry.find({ userId: req.user._id });
      const stats = {
        totalWorkouts: entries.length,
        totalCalories: entries.reduce((sum, e) => sum + (e.calories || 0), 0),
        totalDuration: entries.reduce((sum, e) => sum + (e.duration || 0), 0),
        totalSteps: entries.reduce((sum, e) => sum + (e.steps || 0), 0),
      };
      res.json(stats);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // Diet
  getDietPlans: (req, res) => {
    try {
      const plans = DietPlan.find({ userId: req.user._id });
      res.json(plans);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  createDietPlan: (req, res) => {
    try {
      const totalCalories = req.body.meals?.reduce((sum, meal) => sum + (meal.calories || 0), 0) || 0;
      const plan = DietPlan.create({
        userId: req.user._id,
        ...req.body,
        totalCalories,
      });
      res.status(201).json(plan);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  getDietStats: (req, res) => {
    try {
      const plans = DietPlan.find({ userId: req.user._id });
      const stats = {
        totalCalories: plans.reduce((sum, p) => sum + (p.totalCalories || 0), 0),
        totalDays: plans.length,
        averageCaloriesPerDay: plans.length > 0 ? plans.reduce((sum, p) => sum + (p.totalCalories || 0), 0) / plans.length : 0,
        totalWaterIntake: plans.reduce((sum, p) => sum + (p.waterIntake || 0), 0),
      };
      res.json(stats);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // AI Coaching
  sendMessage: async (req, res) => {
    try {
      const { message } = req.body;
      const userId = req.user._id;
      
      // Get conversation history for context
      const history = Message.find({ userId }).slice(-10); // Last 10 messages
      
      // Import AI coach (dynamic import to avoid circular dependencies)
      const { default: aiCoach } = await import('../utils/aiCoach.js');
      
      // Generate intelligent response
      const aiResponse = aiCoach.generateResponse(message, userId, history);
      
      // Save message to database
      const savedMessage = Message.create({
        userId,
        message,
        aiResponse,
        timestamp: new Date(),
      });

      // Add a small delay to simulate thinking (better UX)
      await new Promise(resolve => setTimeout(resolve, 800 + Math.random() * 1200));

      res.json({
        reply: aiResponse,
        messageId: savedMessage._id,
        timestamp: savedMessage.timestamp
      });
    } catch (error) {
      console.error('AI Coaching error:', error);
      
      // Fallback response if something goes wrong
      const fallbackResponse = `I'm here to help with your health and wellness journey! 

I can provide guidance on:
✅ Nutrition and healthy eating
✅ Exercise and fitness planning  
✅ Sleep optimization
✅ Stress management
✅ General wellness tips

What would you like to know about?`;

      res.json({
        reply: fallbackResponse,
        error: 'fallback_response'
      });
    }
  },

  getChatHistory: (req, res) => {
    try {
      const messages = Message.find({ userId: req.user._id });
      res.json(messages);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  clearChatHistory: (req, res) => {
    try {
      Message.deleteMany({ userId: req.user._id });
      res.json({ message: 'Chat history cleared' });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // Community
  getPosts: (req, res) => {
    try {
      const posts = Post.find({});
      res.json(posts);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  createPost: (req, res) => {
    try {
      const post = Post.create({
        userId: req.user._id,
        content: req.body.content,
        likes: [],
        comments: [],
      });
      res.status(201).json(post);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  getChallenges: (req, res) => {
    try {
      const challenges = Challenge.find({});
      res.json(challenges);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // Reminders
  getReminders: (req, res) => {
    try {
      const reminders = Reminder.find({ userId: req.user._id });
      res.json(reminders);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  createReminder: (req, res) => {
    try {
      const reminder = Reminder.create({
        userId: req.user._id,
        ...req.body,
        isActive: true,
      });
      res.status(201).json(reminder);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // Profile
  getProfile: (req, res) => {
    try {
      const user = User.findById(req.user._id);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      res.json(user);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  updateProfile: (req, res) => {
    try {
      const user = User.findByIdAndUpdate(req.user._id, req.body);
      res.json(user);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
};
