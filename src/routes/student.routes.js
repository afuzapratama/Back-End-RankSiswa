// backend/src/routes/student.routes.js
const router = require('express').Router();
const multer = require('multer');
const auth = require('../middlewares/auth.middleware');
const {
  createStudent,
  getAllStudents,
  updateStudent,
  deleteStudent,
  getAllStudentsWithTotalScores
} = require('../controllers/student.controller');

// Gunakan memoryStorage agar file di-handle di memory, lalu di-upload ke S3
const upload = multer({ storage: multer.memoryStorage() });

// Tambah data siswa + upload foto
router.post('/', auth, upload.single('photo'), createStudent);

// GET semua siswa
router.get('/', auth, getAllStudents);

// GET semua siswa + total poin
router.get('/withTotalScores',  getAllStudentsWithTotalScores);

// Update data siswa
router.put('/:studentId', auth, upload.single('photo'), updateStudent);

// Hapus data siswa
router.delete('/:studentId', auth, deleteStudent);

module.exports = router;
