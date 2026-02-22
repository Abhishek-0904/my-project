const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
    // For development, you can use Mailtrap or a real Gmail account
    // For now, we will try to use the credentials from .env
    const transporter = nodemailer.createTransport({
        service: process.env.EMAIL_SERVICE || 'gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    });

    const mailOptions = {
        from: `"${process.env.EMAIL_FROM_NAME || 'ResumePro Support'}" <${process.env.EMAIL_USER}>`,
        to: options.email,
        subject: options.subject,
        text: options.message,
        html: options.html
    };

    await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;
