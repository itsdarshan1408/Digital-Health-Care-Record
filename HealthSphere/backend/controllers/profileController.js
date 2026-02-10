import User from '../models/User.js';
import bcrypt from 'bcryptjs';

// @desc    Get user profile
// @route   GET /api/profile
// @access  Private
export const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update user profile
// @route   PUT /api/profile
// @access  Private
export const updateProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Update allowed fields
    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;
    user.avatar = req.body.avatar || user.avatar;

    const updatedUser = await user.save();

    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      avatar: updatedUser.avatar,
      preferences: updatedUser.preferences,
      healthMetrics: updatedUser.healthMetrics,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update password
// @route   PUT /api/profile/password
// @access  Private
export const updatePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    const user = await User.findById(req.user._id).select('+passwordHash');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check current password
    const isMatch = await user.matchPassword(currentPassword);

    if (!isMatch) {
      return res.status(400).json({ message: 'Current password is incorrect' });
    }

    // Update password
    user.passwordHash = newPassword;
    await user.save();

    res.json({ message: 'Password updated successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update preferences
// @route   PUT /api/profile/preferences
// @access  Private
export const updatePreferences = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.preferences = {
      ...user.preferences,
      ...req.body,
    };

    const updatedUser = await user.save();

    res.json(updatedUser.preferences);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update health metrics
// @route   PUT /api/profile/health-metrics
// @access  Private
export const updateHealthMetrics = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Calculate BMI if weight and height are provided
    if (req.body.weight && req.body.height) {
      const heightInMeters = req.body.height / 100;
      req.body.bmi = (req.body.weight / (heightInMeters * heightInMeters)).toFixed(1);
    }

    user.healthMetrics = {
      ...user.healthMetrics,
      ...req.body,
    };

    const updatedUser = await user.save();

    res.json(updatedUser.healthMetrics);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete account
// @route   DELETE /api/profile
// @access  Private
export const deleteAccount = async (req, res) => {
  try {
    await User.findByIdAndDelete(req.user._id);
    res.json({ message: 'Account deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
