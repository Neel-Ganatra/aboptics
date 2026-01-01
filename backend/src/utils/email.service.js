const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'gmail', // Or use 'smtp.mailtrap.io' for dev
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

exports.sendOTP = async (email, otp) => {
    try {
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'AB Optician - Verify Your Account',
            text: `Your OTP for AB Optician is: ${otp}. Valid for 10 minutes.`,
            html: `
                <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
                    <h1 style="color: #FFA000;">Verify Your Email</h1>
                    <p>Thank you for registering with AB Optician.</p>
                    <p>Your One-Time Password (OTP) is:</p>
                    <h2 style="background: #000; color: #FFC107; padding: 10px 20px; display: inline-block; border-radius: 5px;">${otp}</h2>
                    <p>This OTP is valid for 10 minutes.</p>
                    <p style="font-size: 12px; color: #888; margin-top: 20px;">If you didn't request this, please ignore this email.</p>
                </div>
            `
        };

        if (process.env.EMAIL_USER) {
            await transporter.sendMail(mailOptions);
            console.log(`OTP sent to ${email}`);
        } else {
            console.log(`[DEV MODE] Mock Email to ${email} with OTP: ${otp}`);
        }
    } catch (error) {
        console.error('Email send error:', error);
        // Don't block flow if email fails in dev, just log
    }
};
