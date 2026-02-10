# 🏥 HealthSphere - Digital Health & Wellness Management Platform

A complete, production-ready MERN stack healthcare application with AI-powered health coaching, fitness tracking, diet planning, and community features.

![HealthSphere](https://img.shields.io/badge/version-1.0.0-blue.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)

## 📋 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Installation](#installation)
- [Configuration](#configuration)
- [Running the Application](#running-the-application)
- [API Documentation](#api-documentation)
- [Project Structure](#project-structure)
- [Screenshots](#screenshots)
- [Contributing](#contributing)
- [License](#license)

## ✨ Features

### 🎯 Core Modules

1. **Dashboard** - Health metrics overview with interactive charts
   - Real-time health stats visualization
   - Weekly activity tracking
   - Quick action buttons

2. **Health Records** - Digital medical record management
   - Upload/view/download medical documents (PDF, images)
   - CRUD operations for medical history
   - Secure file storage

3. **Fitness Tracker** - Activity monitoring and analytics
   - Track workouts, steps, calories, distance
   - Weekly/monthly performance graphs
   - Multiple workout types support

4. **Diet Planner** - Meal planning and nutrition tracking
   - Add meals with calories and macros
   - AI meal suggestions based on goals
   - Daily/weekly calorie visualization

5. **AI Health Coach** - AI-powered wellness guidance
   - Real-time chat with OpenAI integration
   - Ethical, non-diagnostic health advice
   - Persistent conversation history

6. **Community** - Social features and challenges
   - Post updates, like, comment
   - Health challenges with leaderboards
   - Real-time updates via Socket.io

7. **Reminders** - Medication & health activity alerts
   - Scheduled medication reminders
   - Email and in-app notifications
   - Flexible frequency settings

8. **Profile & Settings** - User preferences & account
   - Update profile information
   - Health metrics management
   - Theme and notification preferences

## 🛠️ Tech Stack

### Frontend
- **React.js** (Vite) - UI framework
- **Tailwind CSS** - Styling
- **React Router** - Navigation
- **Context API** - State management
- **Chart.js** - Data visualization
- **Axios** - HTTP client
- **Socket.io Client** - Real-time communication
- **React Toastify** - Notifications

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM
- **JWT** - Authentication
- **bcryptjs** - Password hashing
- **Multer** - File uploads
- **Node-cron** - Task scheduling
- **Socket.io** - Real-time features
- **OpenAI API** - AI chat integration

## 📦 Installation

### Prerequisites

- Node.js (v16 or higher)
- MongoDB (local or MongoDB Atlas)
- npm or yarn

### Clone the Repository

```bash
git clone https://github.com/yourusername/healthsphere.git
cd healthsphere
```

### Backend Setup

```bash
cd backend
npm install

# Copy environment file
cp .env.example .env

# Edit .env with your configuration
# Add your MongoDB URI, JWT secret, OpenAI API key, etc.
```

### Frontend Setup

```bash
cd frontend
npm install

# Copy environment file
cp .env.example .env

# Edit .env if needed (defaults should work for local development)
```

## ⚙️ Configuration

### Backend Environment Variables (.env)

```env
PORT=4000
NODE_ENV=development

# MongoDB
MONGO_URI=mongodb://localhost:27017/healthsphere
# OR for MongoDB Atlas:
# MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/healthsphere

# JWT
JWT_SECRET=your_super_secret_jwt_key_change_in_production
JWT_EXPIRE=7d

# OpenAI (Optional - falls back to default responses)
OPENAI_API_KEY=sk-your-openai-api-key-here

# Email (Optional - for reminders)
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-specific-password
EMAIL_SERVICE=gmail

# Frontend URL
FRONTEND_URL=http://localhost:5173

# File Upload
MAX_FILE_SIZE=10485760
UPLOAD_PATH=./uploads
```

### Frontend Environment Variables (.env)

```env
VITE_API_URL=http://localhost:4000/api
VITE_SOCKET_URL=http://localhost:4000
```

## 🚀 Running the Application

### Development Mode

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```
Server runs on http://localhost:4000

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```
App runs on http://localhost:5173

### Production Mode

**Backend:**
```bash
cd backend
npm start
```

**Frontend:**
```bash
cd frontend
npm run build
npm run preview
```

## 📚 API Documentation

### Authentication Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | Login user |
| GET | `/api/auth/me` | Get current user |

### Health Records

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/records` | Get all records |
| POST | `/api/records` | Create record (with file upload) |
| GET | `/api/records/:id` | Get single record |
| PUT | `/api/records/:id` | Update record |
| DELETE | `/api/records/:id` | Delete record |

### Fitness Tracker

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/fitness` | Get fitness entries |
| POST | `/api/fitness` | Create fitness entry |
| GET | `/api/fitness/stats` | Get fitness statistics |
| PUT | `/api/fitness/:id` | Update entry |
| DELETE | `/api/fitness/:id` | Delete entry |

### Diet Planner

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/diet` | Get diet plans |
| POST | `/api/diet` | Create diet plan |
| GET | `/api/diet/stats` | Get diet statistics |
| POST | `/api/diet/suggestions` | Get AI meal suggestions |
| PUT | `/api/diet/:id` | Update diet plan |
| DELETE | `/api/diet/:id` | Delete diet plan |

### AI Coach

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/ai/coach` | Send message to AI coach |
| GET | `/api/ai/history` | Get chat history |
| DELETE | `/api/ai/history` | Clear chat history |

### Community

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/community/posts` | Get all posts |
| POST | `/api/community/posts` | Create post |
| PUT | `/api/community/posts/:id/like` | Like/unlike post |
| POST | `/api/community/posts/:id/comment` | Add comment |
| GET | `/api/community/challenges` | Get challenges |
| POST | `/api/community/challenges` | Create challenge |
| POST | `/api/community/challenges/:id/join` | Join challenge |

### Reminders

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/reminders` | Get all reminders |
| POST | `/api/reminders` | Create reminder |
| PUT | `/api/reminders/:id` | Update reminder |
| DELETE | `/api/reminders/:id` | Delete reminder |
| PATCH | `/api/reminders/:id/toggle` | Toggle reminder status |

## 📁 Project Structure

```
HealthSphere/
├── backend/
│   ├── config/
│   │   └── db.js
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── recordsController.js
│   │   ├── fitnessController.js
│   │   ├── dietController.js
│   │   ├── coachingController.js
│   │   ├── communityController.js
│   │   ├── remindersController.js
│   │   └── profileController.js
│   ├── middleware/
│   │   ├── auth.js
│   │   ├── errorHandler.js
│   │   └── fileUpload.js
│   ├── models/
│   │   ├── User.js
│   │   ├── HealthRecord.js
│   │   ├── FitnessEntry.js
│   │   ├── DietPlan.js
│   │   ├── Message.js
│   │   ├── Challenge.js
│   │   ├── Reminder.js
│   │   └── Post.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── records.js
│   │   ├── fitness.js
│   │   ├── diet.js
│   │   ├── coaching.js
│   │   ├── community.js
│   │   ├── reminders.js
│   │   └── profile.js
│   ├── utils/
│   │   ├── emailService.js
│   │   └── reminderScheduler.js
│   ├── uploads/
│   ├── .env.example
│   ├── package.json
│   └── server.js
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.jsx
│   │   │   ├── Sidebar.jsx
│   │   │   └── ChatBox.jsx
│   │   ├── context/
│   │   │   └── AuthContext.jsx
│   │   ├── pages/
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   ├── HealthRecords.jsx
│   │   │   ├── FitnessTracker.jsx
│   │   │   ├── DietPlanner.jsx
│   │   │   ├── Coaching.jsx
│   │   │   ├── Community.jsx
│   │   │   ├── Reminders.jsx
│   │   │   └── Profile.jsx
│   │   ├── utils/
│   │   │   ├── axiosInstance.js
│   │   │   └── socket.js
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── .env.example
│   ├── index.html
│   ├── package.json
│   ├── tailwind.config.js
│   ├── postcss.config.js
│   └── vite.config.js
│
└── README.md
```

## 🔐 Default Credentials

For testing purposes, you can create a demo account or use:

**Email:** demo@healthsphere.com  
**Password:** demo123456

*(Note: Create this account via the registration page)*

## 🌟 Key Features Explained

### AI Health Coach
- Powered by OpenAI GPT-3.5-turbo
- Provides general wellness guidance
- Ethical responses (no medical diagnoses)
- Persistent chat history per user
- Fallback responses when API key not configured

### Real-time Features
- Socket.io for instant updates
- Live community posts and likes
- Real-time reminder notifications
- Challenge leaderboard updates

### File Management
- Secure file uploads with Multer
- Support for PDF, JPG, PNG, DOC files
- 10MB max file size
- Files stored locally (configurable for cloud storage)

### Scheduled Reminders
- Node-cron for task scheduling
- Email notifications via Nodemailer
- Socket.io notifications
- Flexible frequency (daily, weekly, monthly, once)

## 🎨 UI/UX Features

- Modern, responsive design
- Dark/Light theme support
- Smooth animations and transitions
- Interactive charts and graphs
- Toast notifications for user feedback
- Mobile-friendly interface

## 🧪 Testing

### Backend Tests

```bash
cd backend
npm test
```

### Manual API Testing

Use tools like Postman or Thunder Client to test the API endpoints.

## 🚢 Deployment

### Backend Deployment (Railway/Render/Heroku)

1. Set environment variables
2. Deploy from GitHub repository
3. Ensure MongoDB connection is configured

### Frontend Deployment (Vercel/Netlify)

1. Build the frontend: `npm run build`
2. Deploy the `dist` folder
3. Set environment variables

### Database (MongoDB Atlas)

1. Create a cluster on MongoDB Atlas
2. Get the connection string
3. Add to backend `.env` file

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 👨‍💻 Author

**HealthSphere Team**

## 🙏 Acknowledgments

- OpenAI for the GPT API
- Chart.js for beautiful visualizations
- Tailwind CSS for amazing styling
- React and Node.js communities

## 📞 Support

For issues and questions:
- Open an issue on GitHub
- Email: support@healthsphere.com

---

**Built with ❤️ using the MERN Stack**
