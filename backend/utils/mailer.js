const nodemailer = require('nodemailer');

async function sendWelcomeEmail(toEmail, name) {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        },
        tls: {
            rejectUnauthorized: false
        }
    });

    await transporter.sendMail({
        from: `"My E-Commerce Site" <${process.env.EMAIL_USER}>`,
        to: toEmail,
        subject: "Welcome!",
        text: `Hi ${name}, welcome to our store!`,
        html: `<h1>Welcome, ${name}!</h1><p>Thanks for signing up.</p>`
    });

    console.log("Real email sent to:", toEmail);
}

module.exports = { sendWelcomeEmail };
