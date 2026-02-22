const dotenv = require('dotenv');
const sendEmail = require('./utils/sendEmail');

dotenv.config();

const testEmail = async () => {
    try {
        console.log('Using EMAIL_USER:', process.env.EMAIL_USER);
        await sendEmail({
            email: process.env.EMAIL_USER,
            subject: 'Test Email from ResumePro',
            message: 'This is a test email to verify your 2FA settings.',
            html: '<h1>Test Successful!</h1><p>Your 2FA email system is now working.</p>'
        });
        console.log('Test email sent successfully!');
    } catch (error) {
        console.error('Test email failed:', error);
    }
};

testEmail();
