const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false, // use TLS
    requireTLS: true,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    },
    logger: true,
    debug: true,
    connectionTimeout: 10000,
    greetingTimeout: 10000,
    socketTimeout: 10000
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

        if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
            console.log("Attempting to send email via SMTP...");
            await transporter.sendMail(mailOptions);
            console.log(`OTP sent to ${email}`);
        } else {
            // If creds missing, mock it immediately
            throw new Error("No Email Credentials provided");
        }
    } catch (error) {
        console.error('SMTP Failed (Blocked?), using Fallback:', error.message);
        console.log(`[FALLBACK] MOCK OTP: ${otp}`);
        // Return the OTP so controller can send it to frontend for Dev Mode
        return otp;
    }
};

exports.sendOrderNotification = async (adminEmail, orderDetails) => {
    try {
        const { orderId, customerName, total, items, address } = orderDetails;

        const itemsHtml = items.map(item =>
            `<li>${item.productName} (x${item.quantity}) - Rs. ${item.price}</li>`
        ).join('');

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: adminEmail,
            subject: `New Order Received - Order #${orderId}`,
            html: `
                <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
                    <h1 style="color: #FFA000;">New Order Alert!</h1>
                    <p><strong>Order ID:</strong> #${orderId}</p>
                    <p><strong>Customer:</strong> ${customerName}</p>
                    <p><strong>Total Amount:</strong> Rs. ${total}</p>
                    
                    <h3>Items Ordered:</h3>
                    <ul>${itemsHtml}</ul>

                    <h3>Shipping Address:</h3>
                    <p>${address}</p>
                </div>
            `
        };

        if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
            console.log("Sending Order Notification to Admin...");
            await transporter.sendMail(mailOptions);
            console.log(`Order notification sent to ${adminEmail}`);
        } else {
            console.log("[MOCK] Order Admin Notification Sent");
        }
    } catch (error) {
        console.error('Failed to send order notification:', error.message);
    }
};
