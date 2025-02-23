// backend/src/models/Subject.js
const mongoose = require('mongoose');

const subjectSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  scoreCategories: [
    {
      type: String
    }
  ],
  // Pastikan 'values' didefinisikan sebagai 'Object' biasa
    scores: [
        {
        studentId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Student',
        },
        values: {
            // bukan type: Map, tapi object
            type: Object,
            default: {}
        }
        }
    ]
  
}, { timestamps: true });

module.exports = mongoose.model('Subject', subjectSchema);
