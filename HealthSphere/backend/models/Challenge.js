import mongoose from 'mongoose';

const participantSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  progress: {
    type: Number,
    default: 0,
  },
  completedAt: Date,
}, { _id: true });

const challengeSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    enum: ['steps', 'calories', 'workouts', 'water', 'meditation', 'custom'],
    default: 'steps',
  },
  goal: {
    type: Number,
    required: true,
  },
  startDate: {
    type: Date,
    required: true,
  },
  endDate: {
    type: Date,
    required: true,
  },
  participants: [participantSchema],
  leaderboard: [{
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    score: Number,
    rank: Number,
  }],
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  isActive: {
    type: Boolean,
    default: true,
  },
}, {
  timestamps: true,
});

const Challenge = mongoose.model('Challenge', challengeSchema);

export default Challenge;
