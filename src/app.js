const express = require('express');
const cors = require('cors');
const morgan = require('morgan'); // optional kalau mau logging
const { connectDB } = require('./config/database');

// Routes
const authRoutes = require('./routes/auth.routes');
const studentRoutes = require('./routes/student.routes');
const subjectRoutes = require('./routes/subject.routes');
const classRoutes = require('./routes/class.routes');

const app = express();

// Koneksi Database
connectDB();

// Middleware global
app.use(cors());
app.use(express.json()); // parse JSON body
app.use(morgan('dev'));  // optional

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/students', studentRoutes);
app.use('/api/subjects', subjectRoutes);
app.use('/api/classes', classRoutes);

// Endpoint default / sanity check
app.get('/', (req, res) => {
  res.send('Welcome to the Node.js + MongoDB + AWS S3 Backend!');
});

module.exports = app;
