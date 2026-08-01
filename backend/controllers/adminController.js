const prisma = require('../utils/prisma');

async function getStats(req, res) {
    try {
        const userCount = await prisma.user.count();
        const productCount = await prisma.product.count();
        const orderCount = await prisma.order.count();
        res.json({ userCount, productCount, orderCount });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

module.exports = { getStats };
