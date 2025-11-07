const nodemailer = require('nodemailer');
const dotEnv = require('dotenv');

dotEnv.config();

// Use environment variables for credentials. Set EMAIL_USER and EMAIL_PASS in your .env file.
// For Gmail, create an App Password (16 chars, no spaces) and set it as EMAIL_PASS.
let transporter;
// Support multiple possible env var names for backwards compatibility with existing .env
const emailUser = process.env.EMAIL_USER || process.env.EMAIL || process.env.EMAIL_ADDRESS;
const emailPass = process.env.EMAIL_PASS || process.env.EMAIL_PASSWORD || process.env.EMAIL_PASSWD;

if (!emailUser || !emailPass) {
    console.error('\n[MAILER] ERROR: EMAIL_USER or EMAIL_PASS is not set in environment variables.');
    console.error('[MAILER] Please add the following to your .env file:');
    console.error('[MAILER] EMAIL_USER=yourgmailaddress@gmail.com');
    console.error('[MAILER] EMAIL_PASS=your_app_password_here');
    console.error('[MAILER] Emails will NOT be sent until these are configured.\n');

    // Create a dummy transporter with same API to avoid further cryptic errors
    transporter = {
        verify: (cb) => cb && cb(new Error('Missing EMAIL_USER or EMAIL_PASS')),
        sendMail: (opts) => {
            const err = new Error('Mail transporter not configured: missing EMAIL_USER or EMAIL_PASS');
            return Promise.reject(err);
        },
    };
} else {
    transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: emailUser,
            pass: emailPass,
        },
        tls: {
            // Allow self-signed certificates in environments where a proxy/inspection
            // replaces SSL certs (useful for local dev). Remove or set to true in prod.
            rejectUnauthorized: false,
        },
    });

    console.log(`[MAILER] configured to use account: ${emailUser}`);

    // Verify transporter configuration on startup (helps debug auth/connectivity issues)
    transporter.verify((err, success) => {
        if (err) {
            console.error('Mailer configuration error:', err);
        } else {
            console.log('Mailer is ready to send messages');
        }
    });
}

module.exports = { transporter };
  
