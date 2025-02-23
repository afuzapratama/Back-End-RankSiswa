// backend/src/models/Student.js
const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  classId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Class', // refer ke model Class
    required: false
  },
  photoUrl: {
    type: String, // Link ke S3
    default: ''
  }
}, { timestamps: true });

module.exports = mongoose.model('Student', studentSchema);
