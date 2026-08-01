const express = require('express');
const router = express.Router();
const { authenticateToken, requireAdmin } = require('../middleware/authmiddleware');
const upload = require('../utils/upload');
const {
    createProduct,
    getProducts,
    getProductById,
    updateProduct,
    deleteProduct
} = require('../controllers/productController');

// Mounted at /products in index.js, so these become:
// POST   /products
// GET    /products
// GET    /products/:id
// PUT    /products/:id
// DELETE /products/:id

router.post('/', authenticateToken, requireAdmin, upload.single('image'), createProduct);
router.get('/', getProducts);
router.get('/:id', getProductById);
router.put('/:id', authenticateToken, requireAdmin, updateProduct);
router.delete('/:id', authenticateToken, requireAdmin, deleteProduct);

module.exports = router;
