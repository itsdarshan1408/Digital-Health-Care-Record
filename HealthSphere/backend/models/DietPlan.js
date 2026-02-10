import mongoose from 'mongoose';

const mealSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    enum: ['breakfast', 'lunch', 'dinner', 'snack'],
    required: true,
  },
  calories: {
    type: Number,
    required: true,
  },
  macros: {
    protein: { type: Number, default: 0 },
    carbs: { type: Number, default: 0 },
    fats: { type: Number, default: 0 },
  },
  ingredients: [String],
  time: String,
}, { _id: true });

const dietPlanSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  meals: [mealSchema],
  totalCalories: {
    type: Number,
    default: 0,
  },
  goal: {
    type: String,
    enum: ['weight-loss', 'muscle-gain', 'maintenance', 'general-health'],
    default: 'general-health',
  },
  waterIntake: {
    type: Number, // in glasses
    default: 0,
  },
  notes: String,
}, {
  timestamps: true,
});

// Calculate total calories before saving
dietPlanSchema.pre('save', function(next) {
  this.totalCalories = this.meals.reduce((sum, meal) => sum + meal.calories, 0);
  next();
});

const DietPlan = mongoose.model('DietPlan', dietPlanSchema);

export default DietPlan;
