const express = require('express');
const router = express.Router();
const productController = require('../controllers/product.controller');
const { verifyToken, isAdmin } = require('../middleware/auth.middleware');

// Public routes
router.get('/', productController.getProducts);
router.get('/:id', productController.getProductById);

const upload = require('../middleware/upload.middleware');

// Admin routes
router.post('/', verifyToken, isAdmin, upload.array('images', 5), productController.createProduct);
router.put('/:id', verifyToken, isAdmin, productController.updateProduct);
// Enhance image route
router.post('/enhance', verifyToken, isAdmin, upload.single('image'), productController.enhanceProductImage);

router.delete('/:id', verifyToken, isAdmin, productController.deleteProduct);

module.exports = router;
