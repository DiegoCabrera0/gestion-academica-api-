const express = require('express');
const router = express.Router();
const studentController = require('../controllers/studentController');
const auth = require('../middleware/authMiddleware');

router.get('/:id', auth, studentController.getProfile);
router.get('/:id/grades', auth, studentController.getGrades);
router.get('/:id/attendance', auth, studentController.getAttendance);
router.get('/schedule/:curso', auth, studentController.getSchedule);
router.get('/:id/tasks', auth, studentController.getTasks);
router.put('/:id/profile', auth, studentController.updateProfile);

module.exports = router;
