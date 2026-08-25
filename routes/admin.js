const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const auth = require('../middleware/authMiddleware');

// Solo administradores deberían acceder a estas rutas
router.post('/users', auth, adminController.createUser);
router.get('/students', auth, adminController.getStudents);
router.get('/teachers', auth, adminController.getTeachers);
router.get('/representatives', auth, adminController.getRepresentatives);
router.delete('/users/:role/:id', auth, adminController.deleteUser);

module.exports = router;
