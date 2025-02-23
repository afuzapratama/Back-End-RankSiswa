// backend/src/models/Class.js
const mongoose = require('mongoose');

const classSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  // Anda bisa menambahkan field lain,
  // misalnya "grade" (tingkat) atau "major" (jurusan)
}, { timestamps: true });

module.exports = mongoose.model('Class', classSchema);
