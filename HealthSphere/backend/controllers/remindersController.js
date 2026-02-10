import Reminder from '../models/Reminder.js';

// @desc    Get all reminders for user
// @route   GET /api/reminders
// @access  Private
export const getReminders = async (req, res) => {
  try {
    const reminders = await Reminder.find({ userId: req.user._id })
      .sort({ 'schedule.time': 1 });

    res.json(reminders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single reminder
// @route   GET /api/reminders/:id
// @access  Private
export const getReminderById = async (req, res) => {
  try {
    const reminder = await Reminder.findOne({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!reminder) {
      return res.status(404).json({ message: 'Reminder not found' });
    }

    res.json(reminder);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create reminder
// @route   POST /api/reminders
// @access  Private
export const createReminder = async (req, res) => {
  try {
    const reminder = await Reminder.create({
      userId: req.user._id,
      ...req.body,
    });

    res.status(201).json(reminder);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update reminder
// @route   PUT /api/reminders/:id
// @access  Private
export const updateReminder = async (req, res) => {
  try {
    const reminder = await Reminder.findOne({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!reminder) {
      return res.status(404).json({ message: 'Reminder not found' });
    }

    const updatedReminder = await Reminder.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    res.json(updatedReminder);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete reminder
// @route   DELETE /api/reminders/:id
// @access  Private
export const deleteReminder = async (req, res) => {
  try {
    const reminder = await Reminder.findOne({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!reminder) {
      return res.status(404).json({ message: 'Reminder not found' });
    }

    await Reminder.findByIdAndDelete(req.params.id);

    res.json({ message: 'Reminder deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Toggle reminder active status
// @route   PATCH /api/reminders/:id/toggle
// @access  Private
export const toggleReminderStatus = async (req, res) => {
  try {
    const reminder = await Reminder.findOne({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!reminder) {
      return res.status(404).json({ message: 'Reminder not found' });
    }

    reminder.isActive = !reminder.isActive;
    await reminder.save();

    res.json(reminder);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
