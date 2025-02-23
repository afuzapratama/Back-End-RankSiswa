// backend/src/routes/subject.routes.js
const router = require('express').Router();
const auth = require('../middlewares/auth.middleware');
const {
  createSubject,
  addScoreCategory,
  addScore,
  getStudentTotalScore,
  getAllSubjects
} = require('../controllers/subject.controller');

// Buat mata pelajaran
router.post('/', auth, createSubject);

// Tambah kategori nilai
router.post('/:subjectId/category', auth, addScoreCategory);

// Tambah nilai
router.post('/:subjectId/score', auth, addScore);

// Lihat total nilai 1 student di 1 subject
router.get('/:subjectId/student/:studentId/total', auth, getStudentTotalScore);

// (opsional) Lihat semua subject
router.get('/', auth, getAllSubjects);

module.exports = router;
