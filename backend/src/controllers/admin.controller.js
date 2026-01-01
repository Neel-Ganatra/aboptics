const prisma = require('../db');

exports.getDashboardStats = async (req, res) => {
    try {
        const totalUsers = await prisma.user.count({ where: { role: 'CUSTOMER' } });
        const totalOrders = await prisma.appointment.count(); // Using appointments as orders for now
        const pendingOrders = await prisma.appointment.count({ where: { status: 'PENDING' } });

        // distinct users who have ordered
        const activeUsersCount = await prisma.appointment.findMany({
            select: { userId: true },
            distinct: ['userId']
        });

        res.json({
            totalUsers,
            totalOrders,
            pendingOrders,
            activeUsers: activeUsersCount.length
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error fetching stats" });
    }
};

exports.getAllOrders = async (req, res) => {
    try {
        const orders = await prisma.appointment.findMany({
            include: { user: { select: { name: true, email: true } } },
            orderBy: { createdAt: 'desc' }
        });
        res.json(orders);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error fetching orders" });
    }
};

exports.updateOrderStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        const updatedOrder = await prisma.appointment.update({
            where: { id: parseInt(id) },
            data: { status }
        });

        res.json(updatedOrder);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error updating status" });
    }
};
