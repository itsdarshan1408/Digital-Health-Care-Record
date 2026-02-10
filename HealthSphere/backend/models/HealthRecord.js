import mongoose from 'mongoose';

const healthRecordSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  title: {
    type: String,
    required: [true, 'Please provide a title for the record'],
    trim: true,
  },
  description: {
    type: String,
    trim: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  files: [{
    filename: String,
    path: String,
    mimetype: String,
    size: Number,
    uploadedAt: {
      type: Date,
      default: Date.now,
    },
  }],
  type: {
    type: String,
    enum: ['lab-report', 'prescription', 'x-ray', 'scan', 'consultation', 'other'],
    default: 'other',
  },
  metadata: {
    doctor: String,
    hospital: String,
    diagnosis: String,
  },
}, {
  timestamps: true,
});

const HealthRecord = mongoose.model('HealthRecord', healthRecordSchema);

export default HealthRecord;
