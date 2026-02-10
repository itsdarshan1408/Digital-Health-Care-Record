import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { createServer } from 'http';
import { Server } from 'socket.io';
import path from 'path';
import { fileURLToPath } from 'url';
// import connectDB from './config/db.js'; // Commented out - using local storage
import { errorHandler, notFound } from './middleware/errorHandler.js';
import { initReminderScheduler } from './utils/reminderScheduler.js';

// Import routes
import authRoutes from './routes/auth.js';
import recordsRoutes from './routes/records.js';
import fitnessRoutes from './routes/fitness.js';
import dietRoutes from './routes/diet.js';
import coachingRoutes from './routes/coaching.js';
import communityRoutes from './routes/community.js';
import remindersRoutes from './routes/reminders.js';
import profileRoutes from './routes/profile.js';
import subscriptionRoutes from './routes/subscription.js';

// Load environment variables
dotenv.config({ path: './config.env' });

// Get __dirname equivalent in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Initialize Express app
const app = express();
const httpServer = createServer(app);

// Initialize Socket.io
const io = new Server(httpServer, {
  cors: {
    origin: process.env.FRONTEND_URL || ['http://localhost:5173', 'http://localhost:5174', 'http://localhost:5175'],
    methods: ['GET', 'POST'],
    credentials: true,
  },
});

// Using Local File Storage instead of MongoDB
console.log('📁 Using local file storage (data folder)');

// Middleware
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" }
}));
app.use(cors({
  origin: process.env.FRONTEND_URL || ['http://localhost:5173', 'http://localhost:5174', 'http://localhost:5175'],
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

// Create uploads directory if it doesn't exist
import fs from 'fs';
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Serve uploaded files
app.use('/uploads', express.static(uploadsDir));

// Socket.io connection handling
io.on('connection', (socket) => {
  console.log(`✅ User connected: ${socket.id}`);

  // Join user to their personal room
  socket.on('join', (userId) => {
    socket.join(userId);
    console.log(`User ${userId} joined their room`);
  });

  // Handle chat messages
  socket.on('chat-message', (data) => {
    io.to(data.userId).emit('chat-response', data);
  });

  // Handle community updates
  socket.on('new-post', (data) => {
    io.emit('post-created', data);
  });

  socket.on('post-liked', (data) => {
    io.emit('post-updated', data);
  });

  socket.on('disconnect', () => {
    console.log(`❌ User disconnected: ${socket.id}`);
  });
});

// Make io accessible in routes
app.set('io', io);

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/records', recordsRoutes);
app.use('/api/fitness', fitnessRoutes);
app.use('/api/diet', dietRoutes);
app.use('/api/ai', coachingRoutes);
app.use('/api/community', communityRoutes);
app.use('/api/reminders', remindersRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/subscription', subscriptionRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

// Root route
app.get('/', (req, res) => {
  res.json({
    message: '🏥 HealthSphere API',
    version: '1.0.0',
    status: 'running',
    endpoints: {
      auth: '/api/auth',
      records: '/api/records',
      fitness: '/api/fitness',
      diet: '/api/diet',
      ai: '/api/ai',
      community: '/api/community',
      reminders: '/api/reminders',
      profile: '/api/profile',
    },
  });
});

// Error handling
app.use(notFound);
app.use(errorHandler);

// Initialize reminder scheduler
initReminderScheduler(io);

// Start server
const PORT = process.env.PORT || 4000;

httpServer.listen(PORT, () => {
  console.log('═══════════════════════════════════════════════════');
  console.log(`🚀 Digital Health Care System Backend Server`);
  console.log(`📡 Server running on port ${PORT}`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🔗 API URL: http://localhost:${PORT}`);
  console.log(`💬 Socket.io initialized`);
  console.log('═══════════════════════════════════════════════════');
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error(`❌ Unhandled Rejection: ${err.message}`);
  httpServer.close(() => process.exit(1));
});

export default app;
