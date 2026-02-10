import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User.js';
import HealthRecord from './models/HealthRecord.js';
import FitnessEntry from './models/FitnessEntry.js';
import DietPlan from './models/DietPlan.js';
import Challenge from './models/Challenge.js';
import Post from './models/Post.js';
import Reminder from './models/Reminder.js';

dotenv.config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ MongoDB Connected');
  } catch (error) {
    console.error('❌ MongoDB Connection Error:', error);
    process.exit(1);
  }
};

const seedData = async () => {
  try {
    // Clear existing data
    await User.deleteMany();
    await HealthRecord.deleteMany();
    await FitnessEntry.deleteMany();
    await DietPlan.deleteMany();
    await Challenge.deleteMany();
    await Post.deleteMany();
    await Reminder.deleteMany();

    console.log('🗑️  Cleared existing data');

    // Create demo user
    const demoUser = await User.create({
      name: 'Demo User',
      email: 'demo@healthsphere.com',
      passwordHash: 'demo123456', // Will be hashed by pre-save hook
      avatar: 'https://ui-avatars.com/api/?name=Demo+User&background=667eea&color=fff',
      healthMetrics: {
        weight: 70,
        height: 175,
        bmi: 22.9,
        bloodPressure: { systolic: 120, diastolic: 80 },
        glucose: 95,
        heartRate: 72,
        sleepHours: 7.5,
      },
      preferences: {
        theme: 'light',
        language: 'en',
        notifications: {
          email: true,
          push: true,
          reminders: true,
        },
      },
    });

    console.log('👤 Created demo user');

    // Create sample health records
    const healthRecords = await HealthRecord.create([
      {
        userId: demoUser._id,
        title: 'Annual Health Checkup',
        description: 'Routine health examination with blood work',
        date: new Date('2024-01-15'),
        type: 'consultation',
        metadata: {
          doctor: 'Dr. Smith',
          hospital: 'City General Hospital',
        },
      },
      {
        userId: demoUser._id,
        title: 'Blood Test Results',
        description: 'Complete blood count and lipid profile',
        date: new Date('2024-02-20'),
        type: 'lab-report',
        metadata: {
          doctor: 'Dr. Johnson',
          hospital: 'MediLab Diagnostics',
        },
      },
    ]);

    console.log('📄 Created health records');

    // Create sample fitness entries
    const today = new Date();
    const fitnessEntries = [];
    
    for (let i = 7; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      
      fitnessEntries.push({
        userId: demoUser._id,
        date,
        type: ['cardio', 'strength', 'yoga', 'running'][Math.floor(Math.random() * 4)],
        duration: 30 + Math.floor(Math.random() * 30),
        calories: 200 + Math.floor(Math.random() * 300),
        steps: 5000 + Math.floor(Math.random() * 5000),
        distance: 3 + Math.floor(Math.random() * 5),
        intensity: ['low', 'medium', 'high'][Math.floor(Math.random() * 3)],
        notes: 'Feeling great after this workout!',
      });
    }

    await FitnessEntry.create(fitnessEntries);
    console.log('💪 Created fitness entries');

    // Create sample diet plans
    const dietPlans = [];
    
    for (let i = 7; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      
      dietPlans.push({
        userId: demoUser._id,
        date,
        meals: [
          {
            name: 'Oatmeal with fruits',
            type: 'breakfast',
            calories: 350,
            macros: { protein: 10, carbs: 60, fats: 8 },
            ingredients: ['Oats', 'Banana', 'Berries', 'Honey'],
          },
          {
            name: 'Grilled chicken salad',
            type: 'lunch',
            calories: 450,
            macros: { protein: 35, carbs: 30, fats: 15 },
            ingredients: ['Chicken breast', 'Mixed greens', 'Olive oil', 'Vegetables'],
          },
          {
            name: 'Salmon with vegetables',
            type: 'dinner',
            calories: 500,
            macros: { protein: 40, carbs: 35, fats: 20 },
            ingredients: ['Salmon fillet', 'Broccoli', 'Sweet potato', 'Lemon'],
          },
          {
            name: 'Greek yogurt',
            type: 'snack',
            calories: 150,
            macros: { protein: 15, carbs: 12, fats: 5 },
            ingredients: ['Greek yogurt', 'Nuts', 'Honey'],
          },
        ],
        goal: 'maintenance',
        waterIntake: 8,
      });
    }

    await DietPlan.create(dietPlans);
    console.log('🥗 Created diet plans');

    // Create sample challenges
    const challenges = await Challenge.create([
      {
        title: '30-Day Step Challenge',
        description: 'Walk 10,000 steps every day for 30 days',
        type: 'steps',
        goal: 10000,
        startDate: new Date(),
        endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        createdBy: demoUser._id,
        participants: [{ userId: demoUser._id, progress: 7500 }],
        leaderboard: [{ userId: demoUser._id, score: 7500, rank: 1 }],
        isActive: true,
      },
      {
        title: 'Hydration Challenge',
        description: 'Drink 8 glasses of water daily',
        type: 'water',
        goal: 8,
        startDate: new Date(),
        endDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
        createdBy: demoUser._id,
        participants: [{ userId: demoUser._id, progress: 6 }],
        leaderboard: [{ userId: demoUser._id, score: 6, rank: 1 }],
        isActive: true,
      },
    ]);

    console.log('🏆 Created challenges');

    // Create sample posts
    const posts = await Post.create([
      {
        userId: demoUser._id,
        content: 'Just completed my first 5K run! Feeling amazing! 🏃‍♂️💪 #FitnessGoals',
        likes: [],
        comments: [],
        tags: ['fitness', 'running', '5k'],
        visibility: 'public',
      },
      {
        userId: demoUser._id,
        content: 'Meal prep Sunday! Prepared healthy meals for the entire week. 🥗🍱 #HealthyEating #MealPrep',
        likes: [],
        comments: [],
        tags: ['nutrition', 'mealprep'],
        visibility: 'public',
      },
    ]);

    console.log('📱 Created community posts');

    // Create sample reminders
    const reminders = await Reminder.create([
      {
        userId: demoUser._id,
        title: 'Morning Medication',
        description: 'Take vitamin D and multivitamin',
        type: 'medication',
        schedule: {
          time: '08:00',
          frequency: 'daily',
          startDate: new Date(),
        },
        isActive: true,
      },
      {
        userId: demoUser._id,
        title: 'Evening Workout',
        description: '30 minutes cardio exercise',
        type: 'exercise',
        schedule: {
          time: '18:00',
          frequency: 'daily',
          startDate: new Date(),
        },
        isActive: true,
      },
      {
        userId: demoUser._id,
        title: 'Water Reminder',
        description: 'Drink a glass of water',
        type: 'water',
        schedule: {
          time: '10:00',
          frequency: 'daily',
          startDate: new Date(),
        },
        isActive: true,
      },
    ]);

    console.log('⏰ Created reminders');

    console.log('\n✅ Seed data created successfully!');
    console.log('\n📧 Demo User Credentials:');
    console.log('Email: demo@healthsphere.com');
    console.log('Password: demo123456');
    console.log('\n');

  } catch (error) {
    console.error('❌ Error seeding data:', error);
  } finally {
    await mongoose.connection.close();
    console.log('🔌 Database connection closed');
    process.exit(0);
  }
};

connectDB().then(seedData);
