// backend/src/controllers/class.controller.js
const ClassModel = require('../models/Class');

// Create
const createClass = async (req, res) => {
  try {
    const { name } = req.body;
    // misalnya "10-A"
    
    // Cek apakah sudah ada
    const existing = await ClassModel.findOne({ name });
    if (existing) {
      return res.status(400).json({ message: 'Class already exists' });
    }

    const newClass = new ClassModel({ name });
    await newClass.save();
    res.status(201).json({ message: 'Class created', class: newClass });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Read (get all classes)
const getAllClasses = async (req, res) => {
  try {
    const classes = await ClassModel.find();
    res.json(classes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update
const updateClass = async (req, res) => {
  try {
    const { classId } = req.params;
    const { name } = req.body;

    const updated = await ClassModel.findByIdAndUpdate(
      classId,
      { name },
      { new: true }
    );
    if (!updated) {
      return res.status(404).json({ message: 'Class not found' });
    }

    res.json({ message: 'Class updated', class: updated });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete
const deleteClass = async (req, res) => {
  try {
    const { classId } = req.params;
    const removed = await ClassModel.findByIdAndDelete(classId);
    if (!removed) {
      return res.status(404).json({ message: 'Class not found' });
    }
    res.json({ message: 'Class deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const findByIdClass = async (req, res) => {
    try {
        const { classId } = req.params;
        const classes = await ClassModel.findById(classId).lean();

        if (!classes) {
            return res.status(404).json({ message: "Class not found" });
        }

        res.json({ data: classes });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


module.exports = {
  createClass,
  getAllClasses,
  updateClass,
  deleteClass,
  findByIdClass
};
