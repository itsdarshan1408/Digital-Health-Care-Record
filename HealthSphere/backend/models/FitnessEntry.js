import mongoose from 'mongoose';

const fitnessEntrySchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  type: {
    type: String,
    enum: ['cardio', 'strength', 'yoga', 'sports', 'walking', 'running', 'cycling', 'other'],
    required: true,
  },
  duration: {
    type: Number, // in minutes
    required: true,
  },
  steps: {
    type: Number,
    default: 0,
  },
  calories: {
    type: Number,
    required: true,
  },
  distance: {
    type: Number, // in kilometers
    default: 0,
  },
  notes: {
    type: String,
  },
  intensity: {
    type: String,
    enum: ['low', 'medium', 'high'],
    default: 'medium',
  },
}, {
  timestamps: true,
});

const FitnessEntry = mongoose.model('FitnessEntry', fitnessEntrySchema);

export default FitnessEntry;
