// backend/src/controllers/student.controller.js
const Student = require('../models/Student');
const Subject = require('../models/Subject');

// Import S3Client instance
const s3 = require('../config/s3');
// Import perintah PutObjectCommand
const { PutObjectCommand } = require('@aws-sdk/client-s3');

const { v4: uuidv4 } = require('uuid');

// Tambah data siswa (+ upload foto)
const createStudent = async (req, res) => {
  try {
    const { name, classId } = req.body; // <-- ambil classId (string objectId)

    let photoUrl = '';
    if (req.file) {
      // 1. Ambil buffer dan buat nama unik
      const file = req.file;
      const fileName = `${uuidv4()}-${file.originalname}`;

      // 2. Buat command upload
      const putCommand = new PutObjectCommand({
        Bucket: process.env.AWS_BUCKET,
        Key: fileName,
        Body: file.buffer,
        ACL: 'public-read' // jika ingin file dapat diakses publik
      });

      // 3. Eksekusi upload
      await s3.send(putCommand);

      // 4. Buat URL manual (karena PutObjectCommand tidak mengembalikan `Location`)
      //    Anda bisa pakai environment AWS_URL yang disediakan, atau build URL sendiri.
      photoUrl = `${process.env.AWS_URL}/${fileName}`;
    }

    const newStudent = new Student({
      name,
      classId,
      photoUrl
    });
    await newStudent.save();

    res.status(201).json({ message: 'Student created', student: newStudent });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Lihat semua data siswa
const getAllStudents = async (req, res) => {
  try {
    const students = await Student.find().populate('classId');
    res.json(students);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update data siswa
const updateStudent = async (req, res) => {
  try {
    const { studentId } = req.params;
    const { name, classId: studentClass } = req.body;

    let updateData = { name, classId: studentClass };

    if (req.file) {
      const file = req.file;
      const fileName = `${uuidv4()}-${file.originalname}`;

      // Gunakan PutObjectCommand juga
      const putCommand = new PutObjectCommand({
        Bucket: process.env.AWS_BUCKET,
        Key: fileName,
        Body: file.buffer,
        ACL: 'public-read'
      });

      await s3.send(putCommand);

      // Buat URL
      updateData.photoUrl = `${process.env.AWS_URL}/${fileName}`;
    }

    const updatedStudent = await Student.findByIdAndUpdate(
      studentId,
      updateData,
      { new: true }
    );

    res.json({ message: 'Student updated', student: updatedStudent });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Hapus data siswa
const deleteStudent = async (req, res) => {
  try {
    const { studentId } = req.params;
    await Student.findByIdAndDelete(studentId);
    res.json({ message: 'Student deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * API menampilkan data siswa beserta total score (points)
 * dari semua mata pelajaran.
 */
const getAllStudentsWithTotalScores = async (req, res) => {
    try {
      // 1. Ambil semua data student
      const students = await Student.find();
  
      const results = [];
      for (const student of students) {
        let totalScore = 0;
  
        // 2. Cari semua subject
        const subjects = await Subject.find({ 'scores.studentId': student._id });
        // di mana 'scores.studentId' = student._id
        // lalu akumulasi semua nilainya
        for (const subject of subjects) {
          // subject.scores => array of { studentId, values:{} }
          const studentScore = subject.scores.find(s => s.studentId.equals(student._id));
          if (studentScore) {
            // studentScore.values => { c1: 80, c2: 70, ...}
            for (const val of Object.values(studentScore.values)) {
              totalScore += val;
            }
          }
        }
  
        // 3. Bentuk response object
        results.push({
          id: student._id,       // atau ganti jadi number jika mau ID 1,2,3 (butuh mekanisme konversi)
          name: student.name,
          points: totalScore,
          image: student.photoUrl || '' // link foto
        });
      }
  
      return res.json(results);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: error.message });
    }
  };

module.exports = {
  createStudent,
  getAllStudents,
  updateStudent,
  deleteStudent,
  getAllStudentsWithTotalScores
};
