# Digital-Health-Care-Record (HealthSphere)

A complete, production-ready full-stack healthcare application featuring AI-powered health coaching, fitness tracking, diet planning, and active community features.

## ✨ Core Features

1. **Dashboard** - Health metrics overview with interactive real-time charts.
2. **Health Records** - Secure digital medical document uploads and records management.
3. **Fitness Tracker** - Track workouts, steps, calories, and view weekly graphs.
4. **Diet Planner** - Meal planning, calorie visualization, and AI meal suggestions.
5. **AI Health Coach** - OpenAI-powered chat for immediate, non-diagnostic wellness guidance.
6. **Community** - Social feed, likes, comments, and health challenges with real-time updates.
7. **Reminders** - Medication and activity alerts via scheduled notifications.

## 🛠️ Technology Stack

### Frontend
- **React.js (Vite)** - Lightning-fast UI framework
- **Tailwind CSS** - Modern, responsive styling
- **Chart.js** - Dynamic data visualization
- **Socket.io Client** - Real-time communication for chats and community

### Backend
- **Node.js & Express.js** - Robust server runtime and web framework
- **JWT & bcryptjs** - Secure authentication and password hashing
- **Socket.io** - Live socket connections for immediate bidirectional updates
- **OpenAI API** - AI integration for the Health Coach 
- **Database Architecture** - Flexible schema; perfectly ready to deploy onto **MongoDB Server/Atlas** (via Mongoose). The current local environment utilizes mocked instances tied to localized JSON datasets (`localStorage.js` inside `/data/`) for an instant, out-of-the-box local developer experience requiring zero database configurations!

## 🚀 How to Run Locally

This project is pre-configured for instant local deployment.

**1. Navigate to the project directory:**
```bash
cd HealthSphere
```

**2. Start the Backend Server:**
```bash
cd backend
npm install
npm run dev
```
*(Runs on Port `4001`. Automatically sets up local `data/` mocks on first run.)*

**3. Start the Frontend Server:**
```bash
cd ../frontend
npm install
npm run dev
```
*(Runs on Port `5173`.)*

**4. Access the Website:**
Navigate to [http://localhost:5173](http://localhost:5173) in your favorite browser. 

### Default Credentials available for Testing:
- **Email:** demo@healthsphere.com
- **Password:** demo123456

## 📁 Project Structure highlights
- `HealthSphere/backend/data/` - Contains the mock `.json` files currently storing users, posts, and health data.
- `HealthSphere/backend/controllers/` - Contains the individual API endpoints operations (Auth, Diet, Fitness, etc.).
- `HealthSphere/frontend/src/pages/` - Contains the individual React component screens.
- `HealthSphere/start.bat` - A Windows bat file to auto-start both environments completely hassle-free.
