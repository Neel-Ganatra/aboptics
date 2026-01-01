const express = require('express');
const { getDashboardStats, getAllOrders, updateOrderStatus } = require('../controllers/admin.controller');
const { verifyToken } = require('../middleware/auth.middleware');
const isAdmin = require('../middleware/admin.middleware');

const router = express.Router();

// All routes here require Auth AND Admin role
router.use(verifyToken, isAdmin);

router.get('/stats', getDashboardStats);
router.get('/orders', getAllOrders);
router.put('/orders/:id/status', updateOrderStatus);

module.exports = router;
