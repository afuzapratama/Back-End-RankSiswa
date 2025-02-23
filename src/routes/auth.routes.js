// backend/src/routes/auth.routes.js
const router = require('express').Router();
const { register, login } = require('../controllers/auth.controller');

// (Opsional) register user
router.post('/register', register);

// Login
router.post('/login', login);

module.exports = router;
