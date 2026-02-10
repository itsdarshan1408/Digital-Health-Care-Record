import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
  aiResponse: {
    type: String,
    required: true,
  },
  structuredResponse: {
    goals: [String],
    meals: [String],
    exercises: [String],
    followUpQuestions: [String],
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
  conversationId: {
    type: String,
    default: function() {
      return `conv_${this.userId}_${Date.now()}`;
    },
  },
}, {
  timestamps: true,
});

const Message = mongoose.model('Message', messageSchema);

export default Message;
