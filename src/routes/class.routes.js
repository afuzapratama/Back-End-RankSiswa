// backend/src/routes/class.routes.js
const router = require('express').Router();
const { createClass, getAllClasses, updateClass, deleteClass, findByIdClass } = require('../controllers/class.controller');
const auth = require('../middlewares/auth.middleware');

// POST /api/classes -> create class
router.post('/', auth, createClass);

// GET /api/classes -> get all
router.get('/', auth, getAllClasses);

// PUT /api/classes/:classId -> update
router.put('/:classId', auth, updateClass);

router.get('/find/:classId', findByIdClass );

// DELETE /api/classes/:classId -> delete
router.delete('/:classId', auth, deleteClass);



module.exports = router;
