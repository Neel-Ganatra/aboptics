const express = require('express');
const router = express.Router();
const appointmentController = require('../controllers/appointment.controller');
const { verifyToken } = require('../middleware/auth.middleware');

// Public or Protected depending on specific requirement, but we need Auth to link user
// If we want guest checkout, we make checkAuth optional or handle missing user in controller. 
// For "Profile" feature, we strictly need auth for 'my-appointments'.

router.post('/', verifyToken, appointmentController.createAppointment);
router.get('/', appointmentController.getAppointments); // Admin?
router.get('/my', verifyToken, appointmentController.getMyAppointments);

module.exports = router;
