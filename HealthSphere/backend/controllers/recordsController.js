import { HealthRecord } from '../models/SimpleModels.js';

// @desc    Get all health records for user
// @route   GET /api/records
// @access  Private
export const getRecords = async (req, res) => {
  try {
    const records = HealthRecord.find({ userId: req.user._id });
    res.json(records);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create new health record
// @route   POST /api/records
// @access  Private
export const createRecord = async (req, res) => {
  try {
    const { title, description, date, type, metadata } = req.body;

    const files = req.files ? req.files.map(file => ({
      filename: file.originalname,
      path: file.path,
      size: file.size,
      mimetype: file.mimetype,
    })) : [];

    const record = HealthRecord.create({
      userId: req.user._id,
      title,
      description,
      date: date || new Date(),
      type,
      files,
      metadata,
    });

    res.status(201).json(record);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single health record
// @route   GET /api/records/:id
// @access  Private
export const getRecordById = async (req, res) => {
  try {
    const record = HealthRecord.findOne({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!record) {
      return res.status(404).json({ message: 'Record not found' });
    }

    res.json(record);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update health record
// @route   PUT /api/records/:id
// @access  Private
export const updateRecord = async (req, res) => {
  try {
    const record = HealthRecord.findOne({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!record) {
      return res.status(404).json({ message: 'Record not found' });
    }

    const updatedRecord = HealthRecord.findByIdAndUpdate(req.params.id, req.body);

    res.json(updatedRecord);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete health record
// @route   DELETE /api/records/:id
// @access  Private
export const deleteRecord = async (req, res) => {
  try {
    const record = HealthRecord.findOne({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!record) {
      return res.status(404).json({ message: 'Record not found' });
    }

    HealthRecord.findByIdAndDelete(req.params.id);

    res.json({ message: 'Record deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
