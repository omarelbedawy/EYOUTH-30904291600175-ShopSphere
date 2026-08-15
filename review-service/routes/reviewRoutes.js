const express = require('express');
const router = express.Router();
const { getReviewsForProduct, createReview, deleteReview } = require('../controllers/reviewController');

// Mounted at /reviews in index.js, so these become:
// GET    /reviews/product/:productId
// POST   /reviews/product/:productId
// DELETE /reviews/:id

router.get('/product/:productId', getReviewsForProduct);
router.post('/product/:productId', createReview);
router.delete('/:id', deleteReview);

module.exports = router;
