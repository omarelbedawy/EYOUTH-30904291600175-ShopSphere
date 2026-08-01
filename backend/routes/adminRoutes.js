const express = require('express');
const router = express.Router();
const { authenticateToken, requireAdmin } = require('../middleware/authmiddleware');
const { getStats } = require('../controllers/adminController');

// Mounted at /admin in index.js, so this becomes:
// GET /admin/stats

router.get('/stats', authenticateToken, requireAdmin, getStats);

module.exports = router;
