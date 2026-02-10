import { FitnessEntry } from '../models/SimpleModels.js';

// @desc    Get all fitness entries for user
// @route   GET /api/fitness
// @access  Private
export const getFitnessEntries = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    
    let query = { userId: req.user._id };
    
    if (startDate && endDate) {
      query.date = {
        $gte: new Date(startDate),
        $lte: new Date(endDate),
      };
    }

    const entries = FitnessEntry.find(query);
    
    res.json(entries);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get fitness stats
// @route   GET /api/fitness/stats
// @access  Private
export const getFitnessStats = async (req, res) => {
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
      case 'year':
        startDate = new Date(now.setFullYear(now.getFullYear() - 1));
        break;
      default:
        startDate = new Date(now.setDate(now.getDate() - 7));
    }

    const entries = await FitnessEntry.find({
      userId: req.user._id,
      date: { $gte: startDate },
    });

    const stats = {
      totalWorkouts: entries.length,
      totalDuration: entries.reduce((sum, entry) => sum + entry.duration, 0),
      totalCalories: entries.reduce((sum, entry) => sum + entry.calories, 0),
      totalSteps: entries.reduce((sum, entry) => sum + entry.steps, 0),
      totalDistance: entries.reduce((sum, entry) => sum + entry.distance, 0),
      averageCaloriesPerWorkout: entries.length > 0 
        ? entries.reduce((sum, entry) => sum + entry.calories, 0) / entries.length 
        : 0,
    };

    res.json(stats);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create fitness entry
// @route   POST /api/fitness
// @access  Private
export const createFitnessEntry = async (req, res) => {
  try {
    const entry = await FitnessEntry.create({
      userId: req.user._id,
      ...req.body,
    });

    res.status(201).json(entry);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update fitness entry
// @route   PUT /api/fitness/:id
// @access  Private
export const updateFitnessEntry = async (req, res) => {
  try {
    const entry = await FitnessEntry.findOne({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!entry) {
      return res.status(404).json({ message: 'Entry not found' });
    }

    const updatedEntry = await FitnessEntry.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    res.json(updatedEntry);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete fitness entry
// @route   DELETE /api/fitness/:id
// @access  Private
export const deleteFitnessEntry = async (req, res) => {
  try {
    const entry = await FitnessEntry.findOne({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!entry) {
      return res.status(404).json({ message: 'Entry not found' });
    }

    await FitnessEntry.findByIdAndDelete(req.params.id);

    res.json({ message: 'Entry deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
