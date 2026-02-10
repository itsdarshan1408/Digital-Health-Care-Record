# 🚀 HealthSphere Quick Setup Guide

Follow these steps to get HealthSphere up and running on your local machine.

## 📋 Prerequisites

Make sure you have the following installed:
- **Node.js** (v16 or higher) - [Download](https://nodejs.org/)
- **MongoDB** - [Download](https://www.mongodb.com/try/download/community) or use [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
- **Git** - [Download](https://git-scm.com/)

## 🛠️ Step-by-Step Installation

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/healthsphere.git
cd HealthSphere
```

### 2. Backend Setup

```bash
# Navigate to backend folder
cd backend

# Install dependencies
npm install

# Create environment file
cp .env.example .env
```

**Edit the `.env` file with your configuration:**

```env
PORT=4000
MONGO_URI=mongodb://localhost:27017/healthsphere
JWT_SECRET=your_random_secret_key_here
OPENAI_API_KEY=sk-your-key-here  # Optional
EMAIL_USER=your-email@gmail.com   # Optional
EMAIL_PASS=your-password          # Optional
FRONTEND_URL=http://localhost:5173
```

### 3. Frontend Setup

```bash
# Navigate to frontend folder (from project root)
cd ../frontend

# Install dependencies
npm install

# Create environment file (optional - defaults work fine)
cp .env.example .env
```

### 4. Database Setup

#### Option A: Local MongoDB

If MongoDB is installed locally, it should be running on `mongodb://localhost:27017`.

Start MongoDB:
```bash
# Windows
mongod

# macOS/Linux
sudo systemctl start mongod
```

#### Option B: MongoDB Atlas (Cloud)

1. Create a free account at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a new cluster
3. Get your connection string
4. Update `MONGO_URI` in backend `.env` file

### 5. Seed Sample Data (Optional)

To populate the database with demo data:

```bash
cd backend
npm run seed
```

This will create:
- Demo user account (email: demo@healthsphere.com, password: demo123456)
- Sample health records
- Fitness entries
- Diet plans
- Community posts
- Challenges
- Reminders

### 6. Start the Application

**Terminal 1 - Start Backend:**
```bash
cd backend
npm run dev
```

You should see:
```
🚀 HealthSphere Backend Server
📡 Server running on port 4000
✅ MongoDB Connected
```

**Terminal 2 - Start Frontend:**
```bash
cd frontend
npm run dev
```

You should see:
```
VITE v5.x.x ready in xxx ms
➜  Local:   http://localhost:5173/
```

### 7. Access the Application

Open your browser and go to: **http://localhost:5173**

## 🎯 Testing the Application

### Demo Account

Use the seeded demo account:
- **Email:** demo@healthsphere.com
- **Password:** demo123456

Or create a new account by clicking "Sign up" on the login page.

## 🔧 Troubleshooting

### Backend won't start

**Error: "MongoDB connection failed"**
- Check if MongoDB is running
- Verify `MONGO_URI` in `.env` is correct
- For Atlas, check your IP is whitelisted

**Error: "Port 4000 is already in use"**
```bash
# Change PORT in backend .env to another port (e.g., 5000)
PORT=5000
```

### Frontend won't start

**Error: "Port 5173 is already in use"**
```bash
# Kill the process or change port in vite.config.js
```

**Error: "Cannot connect to API"**
- Make sure backend is running
- Check `VITE_API_URL` in frontend `.env`

### AI Chat not working

The AI chat will still work with fallback responses even without an OpenAI API key. To enable full AI features:

1. Get an API key from [OpenAI](https://platform.openai.com/)
2. Add it to backend `.env`:
```env
OPENAI_API_KEY=sk-your-actual-api-key-here
```
3. Restart the backend server

### Email notifications not working

Email notifications are optional. To enable:

1. For Gmail, create an [App Password](https://support.google.com/accounts/answer/185833)
2. Add credentials to backend `.env`:
```env
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
EMAIL_SERVICE=gmail
```
3. Restart the backend server

## 📱 Features to Test

1. **Dashboard** - View health metrics and charts
2. **Health Records** - Upload and manage medical documents
3. **Fitness Tracker** - Log workouts and view statistics
4. **Diet Planner** - Create meal plans and track calories
5. **AI Coach** - Chat with the AI health assistant
6. **Community** - Create posts and join challenges
7. **Reminders** - Set medication and activity reminders
8. **Profile** - Update personal and health information

## 🎨 Customization

### Change Theme

The app supports light/dark themes. Toggle using the moon/sun icon in the navbar.

### Modify Colors

Edit `frontend/tailwind.config.js` to customize the color scheme.

## 📊 Sample Data Overview

After running `npm run seed`, you'll have:

- **7 days** of fitness entries
- **7 days** of diet plans
- **2** health records
- **2** community posts
- **2** active challenges
- **3** active reminders

## 🔐 Security Notes

For production deployment:

1. Change `JWT_SECRET` to a strong random string
2. Use environment-specific `.env` files
3. Enable HTTPS
4. Set secure CORS policies
5. Use MongoDB Atlas with IP whitelisting
6. Keep API keys secure (never commit to Git)

## 🚀 Production Deployment

### Backend (Railway/Render)
1. Push code to GitHub
2. Connect repository to hosting platform
3. Set environment variables
4. Deploy

### Frontend (Vercel/Netlify)
1. Run `npm run build` in frontend folder
2. Deploy `dist` folder
3. Set environment variables

### Database (MongoDB Atlas)
1. Use production cluster
2. Enable authentication
3. Whitelist deployment server IPs

## 📞 Need Help?

- Check the main [README.md](./README.md)
- Open an issue on GitHub
- Review error logs in the terminal

## ✅ Verification Checklist

- [ ] Node.js and npm installed
- [ ] MongoDB running (local or Atlas)
- [ ] Backend dependencies installed
- [ ] Frontend dependencies installed
- [ ] Backend `.env` configured
- [ ] Backend server started successfully
- [ ] Frontend server started successfully
- [ ] Can access http://localhost:5173
- [ ] Can login/register
- [ ] All features working

---

**Congratulations! 🎉 HealthSphere is now running on your machine!**

Happy coding! 💻
