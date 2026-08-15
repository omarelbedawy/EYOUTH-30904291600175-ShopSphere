const prisma = require('../utils/prisma');

async function getReviewsForProduct(req, res) {
    try {
        const productId = parseInt(req.params.productId);
        const reviews = await prisma.review.findMany({
            where: { productId },
            orderBy: { createdAt: 'desc' }
        });

        const avgRating = reviews.length
            ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
            : null;

        res.json({ reviews, count: reviews.length, avgRating });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

async function createReview(req, res) {
    try {
        const productId = parseInt(req.params.productId);
        const { authorName, rating, comment } = req.body;

        if (!authorName || !rating) {
            return res.status(400).json({ error: "authorName and rating are required" });
        }
        if (rating < 1 || rating > 5) {
            return res.status(400).json({ error: "rating must be between 1 and 5" });
        }

        const review = await prisma.review.create({
            data: { productId, authorName, rating: parseInt(rating), comment }
        });

        res.status(201).json(review);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

async function deleteReview(req, res) {
    try {
        const id = parseInt(req.params.id);
        const deleted = await prisma.review.delete({ where: { id } });
        res.json(deleted);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

module.exports = { getReviewsForProduct, createReview, deleteReview };
