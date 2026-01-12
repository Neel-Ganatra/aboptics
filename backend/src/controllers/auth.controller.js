const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const prisma = require('../db');

const JWT_SECRET = process.env.JWT_SECRET || 'supersecretkeydev';

const emailService = require('../utils/email.service');

exports.register = async (req, res) => {
    try {
        const { email, password, name } = req.body;

        const existingUser = await prisma.user.findUnique({ where: { email } });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 mins

        await prisma.user.create({
            data: {
                email,
                password: hashedPassword,
                name,
                otp,
                otpExpiry,
                isVerified: false
            }
        });

        await emailService.sendOTP(email, otp);

        res.status(201).json({ message: 'OTP sent to email. Please verify.' });
    } catch (error) {
        console.error("Registration Error:", error);
        if (error.message.includes('Failed to send OTP')) {
            // Delete user if email failed so they can try again
            await prisma.user.delete({ where: { email: req.body.email } }).catch(() => { });
            return res.status(500).json({ message: 'Email service failed. check server logs.' });
        }
        res.status(500).json({ message: 'Server error on register' });
    }
};

exports.verifyOtp = async (req, res) => {
    try {
        const { email, otp } = req.body;
        const user = await prisma.user.findUnique({ where: { email } });

        if (!user) return res.status(400).json({ message: 'User not found' });
        if (user.isVerified) return res.status(400).json({ message: 'User already verified' });

        if (user.otp !== otp || new Date() > new Date(user.otpExpiry)) {
            return res.status(400).json({ message: 'Invalid or expired OTP' });
        }

        const updatedUser = await prisma.user.update({
            where: { email },
            data: { isVerified: true, otp: null, otpExpiry: null }
        });

        const token = jwt.sign({ userId: updatedUser.id, role: updatedUser.role }, JWT_SECRET, { expiresIn: '7d' });
        res.json({ token, user: { id: updatedUser.id, email: updatedUser.email, name: updatedUser.name, role: updatedUser.role } });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Verification failed' });
    }
};

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        if (!user.isVerified) {
            return res.status(403).json({ message: 'Account not verified. Please verify OTP.' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        const token = jwt.sign({ userId: user.id, role: user.role }, JWT_SECRET, { expiresIn: '7d' });

        res.json({ token, user: { id: user.id, email: user.email, name: user.name, role: user.role } });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error on login' });
    }
};
exports.resendOtp = async (req, res) => {
    try {
        const { email } = req.body;
        const user = await prisma.user.findUnique({ where: { email } });

        if (!user) return res.status(400).json({ message: 'User not found' });
        if (user.isVerified) return res.status(400).json({ message: 'User already verified' });

        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 mins

        await prisma.user.update({
            where: { email },
            data: { otp, otpExpiry }
        });

        await emailService.sendOTP(email, otp);

        res.json({ message: 'New OTP sent to email' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to resend OTP' });
    }
};
