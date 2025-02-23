// backend/src/controllers/subject.controller.js
const Subject = require('../models/Subject');
const Student = require('../models/Student');

// Tambah mata pelajaran
const createSubject = async (req, res) => {
  try {
    const { name } = req.body;
    
    const existingSubject = await Subject.findOne({ name });
    if (existingSubject) {
      return res.status(400).json({ message: 'Subject already exists' });
    }

    const newSubject = new Subject({ name });
    await newSubject.save();

    res.status(201).json({ message: 'Subject created', subject: newSubject });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Tambah kategori nilai ke subject (misal: "c1")
const addScoreCategory = async (req, res) => {
  try {
    const { subjectId } = req.params;
    const { category } = req.body; // ex: "c1"

    const subject = await Subject.findById(subjectId);
    if (!subject) {
      return res.status(404).json({ message: 'Subject not found' });
    }

    // Cek apakah category sudah ada
    if (subject.scoreCategories.includes(category)) {
      return res.status(400).json({ message: 'Category already exists in this subject' });
    }

    subject.scoreCategories.push(category);
    await subject.save();

    res.json({ message: 'Score category added', subject });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Input nilai untuk student dalam suatu subject
// body: { studentId, category, score }
// Tambah Nilai ke subject
const addScore = async (req, res) => {
    try {
      const { subjectId } = req.params;
      const { studentId, category, score } = req.body;
  
      if (score > 100) {
        return res.status(400).json({ message: 'Score cannot exceed 100' });
      }
  
      const subject = await Subject.findById(subjectId);
      if (!subject) {
        return res.status(404).json({ message: 'Subject not found' });
      }
  
      // Cek category
      if (!subject.scoreCategories.includes(category)) {
        return res.status(400).json({ message: 'Category does not exist in subject' });
      }
  
      // Cek student
      const student = await Student.findById(studentId);
      if (!student) {
        return res.status(404).json({ message: 'Student not found' });
      }
  
      // Cari scores array
      let studentScore = subject.scores.find(s => s.studentId.equals(studentId));
      if (!studentScore) {
        // buat kalau belum ada
        studentScore = {
          studentId,
          values: {}
        };
        subject.scores.push(studentScore);
      }
  
      // Karena 'values' adalah object biasa, pakai bracket notation
      studentScore.values[category] = score;
      subject.markModified('scores');
      await subject.save();

      return res.json({ message: 'Score added/updated', subject });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  };
  

// Lihat total nilai 1 student di 1 subject
const getStudentTotalScore = async (req, res) => {
  try {
    const { subjectId, studentId } = req.params;

    const subject = await Subject.findById(subjectId);
    if (!subject) {
      return res.status(404).json({ message: 'Subject not found' });
    }

    const studentScore = subject.scores.find(s => s.studentId.equals(studentId));
    if (!studentScore) {
      return res.json({ total: 0 }); // tidak ada nilai
    }

    let total = 0;
    for (const val of studentScore.values.values()) {
      total += val;
    }

    res.json({ total });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Lihat semua subject & scores (opsional)
const getAllSubjects = async (req, res) => {
  try {
    // populate agar bisa dapat data student
    const subjects = await Subject.find().populate('scores.studentId');
    res.json(subjects);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createSubject,
  addScoreCategory,
  addScore,
  getStudentTotalScore,
  getAllSubjects
};
