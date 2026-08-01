const prisma = require('../utils/prisma');

async function createOrder(req, res) {
    const { items } = req.body;

    try {
        const result = await prisma.$transaction(async (tx) => {
            let total = 0;
            for (const item of items) {
                const product = await tx.product.findUnique({
                    where: { id: item.productId }
                });
                total += product.price * item.quantity;
            }

            const newOrder = await tx.order.create({
                data: {
                    total,
                    userId: req.userId,
                    orderItems: {
                        create: items.map(item => ({
                            productId: item.productId,
                            quantity: item.quantity
                        }))
                    }
                },
                include: { orderItems: true }
            });

            for (const item of items) {
                await tx.product.update({
                    where: { id: item.productId },
                    data: { stock: { decrement: item.quantity } }
                });
            }

            return newOrder;
        });

        res.status(201).json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

async function getMyOrders(req, res) {
    try {
        const orders = await prisma.order.findMany({
            where: { userId: req.userId },
            include: { orderItems: true }
        });
        res.json(orders);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

module.exports = { createOrder, getMyOrders };
