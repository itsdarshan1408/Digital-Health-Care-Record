import DietPlan from '../models/DietPlan.js';

// @desc    Get all diet plans for user
// @route   GET /api/diet
// @access  Private
export const getDietPlans = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    
    let query = { userId: req.user._id };
    
    if (startDate && endDate) {
      query.date = {
        $gte: new Date(startDate),
        $lte: new Date(endDate),
      };
    }

    const plans = await DietPlan.find(query).sort({ date: -1 });
    
    res.json(plans);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get diet stats
// @route   GET /api/diet/stats
// @access  Private
export const getDietStats = async (req, res) => {
  try {
    const { period = 'week' } = req.query;
    
    const now = new Date();
    let startDate;
    
    switch(period) {
      case 'week':
        startDate = new Date(now.setDate(now.getDate() - 7));
        break;
      case 'month':
        startDate = new Date(now.setMonth(now.getMonth() - 1));
        break;
      default:
        startDate = new Date(now.setDate(now.getDate() - 7));
    }

    const plans = await DietPlan.find({
      userId: req.user._id,
      date: { $gte: startDate },
    });

    const stats = {
      totalDays: plans.length,
      totalCalories: plans.reduce((sum, plan) => sum + plan.totalCalories, 0),
      averageCaloriesPerDay: plans.length > 0 
        ? plans.reduce((sum, plan) => sum + plan.totalCalories, 0) / plans.length 
        : 0,
      totalWaterIntake: plans.reduce((sum, plan) => sum + plan.waterIntake, 0),
    };

    res.json(stats);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create diet plan
// @route   POST /api/diet
// @access  Private
export const createDietPlan = async (req, res) => {
  try {
    const plan = await DietPlan.create({
      userId: req.user._id,
      ...req.body,
    });

    res.status(201).json(plan);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update diet plan
// @route   PUT /api/diet/:id
// @access  Private
export const updateDietPlan = async (req, res) => {
  try {
    const plan = await DietPlan.findOne({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!plan) {
      return res.status(404).json({ message: 'Diet plan not found' });
    }

    const updatedPlan = await DietPlan.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    res.json(updatedPlan);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete diet plan
// @route   DELETE /api/diet/:id
// @access  Private
export const deleteDietPlan = async (req, res) => {
  try {
    const plan = await DietPlan.findOne({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!plan) {
      return res.status(404).json({ message: 'Diet plan not found' });
    }

    await DietPlan.findByIdAndDelete(req.params.id);

    res.json({ message: 'Diet plan deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Generate AI meal suggestions
// @route   POST /api/diet/suggestions
// @access  Private
export const getMealSuggestions = async (req, res) => {
  try {
    const { goal, calories, preferences } = req.body;

    // Predefined meal suggestions (in production, use OpenAI API)
    const suggestions = {
      'weight-loss': {
        breakfast: ['Oatmeal with berries', 'Greek yogurt with nuts', 'Egg white omelet'],
        lunch: ['Grilled chicken salad', 'Quinoa bowl with vegetables', 'Tuna wrap'],
        dinner: ['Baked salmon with broccoli', 'Turkey stir-fry', 'Vegetable soup'],
        snack: ['Apple slices', 'Carrot sticks with hummus', 'Almonds'],
      },
      'muscle-gain': {
        breakfast: ['Protein pancakes', 'Scrambled eggs with whole grain toast', 'Protein smoothie'],
        lunch: ['Chicken breast with rice', 'Beef and quinoa', 'Turkey sandwich'],
        dinner: ['Steak with sweet potato', 'Grilled chicken pasta', 'Salmon with brown rice'],
        snack: ['Protein shake', 'Peanut butter toast', 'Greek yogurt'],
      },
      'maintenance': {
        breakfast: ['Whole grain cereal', 'Avocado toast', 'Fruit smoothie'],
        lunch: ['Chicken Caesar salad', 'Pasta primavera', 'Vegetable wrap'],
        dinner: ['Grilled fish with vegetables', 'Chicken curry with rice', 'Vegetable lasagna'],
        snack: ['Mixed nuts', 'Fruit', 'Cheese and crackers'],
      },
    };

    const goalSuggestions = suggestions[goal] || suggestions['maintenance'];

    res.json({
      goal,
      targetCalories: calories,
      suggestions: goalSuggestions,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
