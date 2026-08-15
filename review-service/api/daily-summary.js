// This is a separate serverless function from the main review-service Express
// app above — Vercel Cron triggers it directly on a schedule, not through any
// HTTP request from the frontend or backend. It runs as a background job:
// no user request ever calls this route.
const { PrismaClient } = require('@prisma/client');

module.exports = async function handler(req, res) {
    // Vercel Cron sends a special header; reject calls that don't have it
    // so this can't be triggered by a random public request.
    if (req.headers['authorization'] !== `Bearer ${process.env.CRON_SECRET}`) {
        return res.status(401).json({ error: 'Unauthorized' });
    }

    const prisma = new PrismaClient();

    try {
        const totalReviews = await prisma.review.count();
        const reviews = await prisma.review.findMany({ select: { rating: true } });
        const avgRating = reviews.length
            ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(2)
            : 0;

        const summary = {
            date: new Date().toISOString(),
            totalReviews,
            avgRating
        };

        // In a fuller build this could email the summary or write it to a
        // stats table. For now it logs to Vercel's function logs, which is
        // enough to prove the job ran on its own schedule.
        console.log('Daily review summary:', summary);

        res.status(200).json(summary);
    } catch (error) {
        res.status(500).json({ error: error.message });
    } finally {
        await prisma.$disconnect();
    }
};
