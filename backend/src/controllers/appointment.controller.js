const prisma = require('../db');

exports.createAppointment = async (req, res) => {
    try {
        const { name, phone, address, date, time, items } = req.body;
        const userId = req.user ? req.user.userId : null; // Get ID from middleware if available

        const appointment = await prisma.appointment.create({
            data: {
                userId, // Link to user
                name,
                phone,
                address,
                date: new Date(date + 'T' + time.split(' ')[0] + ':00'),
                status: 'PENDING',
                items: items || []
            }
        });

        res.status(201).json({ message: 'Appointment booked successfully', appointment });
    } catch (error) {
        console.error("Book Appointment Error:", error);
        res.status(500).json({ message: 'Failed to book appointment', error: error.message });
    }
};

exports.getAppointments = async (req, res) => {
    try {
        const appointments = await prisma.appointment.findMany({
            orderBy: { createdAt: 'desc' },
            include: { user: { select: { name: true, email: true } } } // Optional: include user details
        });
        res.json(appointments);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch appointments' });
    }
};

exports.getMyAppointments = async (req, res) => {
    try {
        const userId = req.user.userId;
        const appointments = await prisma.appointment.findMany({
            where: { userId: userId },
            orderBy: { createdAt: 'desc' }
        });
        res.json(appointments);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch your history' });
    }
};
