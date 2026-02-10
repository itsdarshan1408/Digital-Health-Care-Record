import mongoose from 'mongoose';

const reminderSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  type: {
    type: String,
    enum: ['medication', 'appointment', 'exercise', 'water', 'meal', 'other'],
    default: 'medication',
  },
  schedule: {
    time: {
      type: String, // Format: "HH:MM"
      required: true,
    },
    frequency: {
      type: String,
      enum: ['once', 'daily', 'weekly', 'monthly'],
      default: 'daily',
    },
    daysOfWeek: [Number], // 0-6 (Sunday-Saturday)
    startDate: {
      type: Date,
      default: Date.now,
    },
    endDate: Date,
  },
  notified: {
    type: Boolean,
    default: false,
  },
  lastNotified: Date,
  isActive: {
    type: Boolean,
    default: true,
  },
}, {
  timestamps: true,
});

const Reminder = mongoose.model('Reminder', reminderSchema);

export default Reminder;
