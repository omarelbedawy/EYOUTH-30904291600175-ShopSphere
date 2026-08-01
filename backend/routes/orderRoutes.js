const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/authmiddleware');
const { createOrder, getMyOrders } = require('../controllers/orderController');

// Mounted at /orders in index.js, so these become:
// POST /orders
// GET  /orders

router.post('/', authenticateToken, createOrder);
router.get('/', authenticateToken, getMyOrders);

module.exports = router;
