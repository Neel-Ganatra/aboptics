const prisma = require('../db');

exports.createOrder = async (req, res) => {
    try {
        const userId = req.user.userId;
        const { items, total } = req.body;

        if (!items || items.length === 0) {
            return res.status(400).json({ message: 'No items in order' });
        }

        // Transaction to ensure consistent data
        const order = await prisma.$transaction(async (prisma) => {
            // 1. Create the Order
            const newOrder = await prisma.order.create({
                data: {
                    userId,
                    total: parseFloat(total),
                    status: 'PENDING',
                    items: {
                        create: items.map(item => ({
                            productId: item.productId,
                            quantity: item.quantity,
                            price: parseFloat(item.price)
                        }))
                    }
                },
                include: {
                    items: true
                }
            });

            // 2. Reduce stock for each product (Optional but good practice)
            // Note: If you want strict stock management, you'd check stock first.
            // For now, we'll just skip stock deduction or do it simply.
            // Doing it here loop-wise:
            /*
            for (const item of items) {
                await prisma.product.update({
                    where: { id: item.productId },
                    data: { stock: { decrement: item.quantity } }
                });
            }
            */

            return newOrder;
        });

        res.status(201).json(order);
    } catch (error) {
        console.error('Error creating order:', error);
        res.status(500).json({ message: 'Server error creating order' });
    }
};

exports.getUserOrders = async (req, res) => {
    try {
        const userId = req.user.userId;

        const orders = await prisma.order.findMany({
            where: { userId },
            include: {
                items: {
                    include: {
                        product: true
                    }
                }
            },
            orderBy: { createdAt: 'desc' }
        });

        res.json(orders);
    } catch (error) {
        console.error('Error fetching user orders:', error);
        res.status(500).json({ message: 'Server error fetching orders' });
    }
};
