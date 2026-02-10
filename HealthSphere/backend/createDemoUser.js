import bcrypt from 'bcryptjs';
import { User } from './models/SimpleModels.js';

const createDemoUser = async () => {
  try {
    // Check if demo user already exists
    const existingUser = User.findOne({ email: 'demo@healthsphere.com' });
    
    if (existingUser) {
      console.log('Demo user already exists');
      return;
    }

    // Hash the demo password
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash('demo123456', salt);

    // Create demo user
    const demoUser = User.create({
      name: 'Demo User',
      email: 'demo@healthsphere.com',
      passwordHash,
      avatar: 'https://ui-avatars.com/api/?name=Demo%20User&background=667eea&color=fff',
      preferences: {
        theme: 'light',
        language: 'en',
        notifications: { email: true, push: true, reminders: true }
      }
    });

    console.log('Demo user created successfully:', demoUser);
  } catch (error) {
    console.error('Error creating demo user:', error);
  }
};

createDemoUser();
