const { transporter } = require('./Email.confiq'); // Ensure this path is correct

const sendverificationcode = async (email, verificationcode) => {
    try {
        const mailOptions = {
            from: `"work Board 👻" <${process.env.EMAIL_USER || 'no-reply@example.com'}>`, // sender address
            to: email, // list of receivers
            subject: 'Verify your Email', // Subject line
            text: `Your verification code is: ${verificationcode}`, // plain text body
            html: `<div style="font-family: Arial, sans-serif; line-height:1.4;">
                      <p>Hello,</p>
                      <p>Your verification code is:</p>
                      <h2 style="letter-spacing:4px">${verificationcode}</h2>
                      <p>If you didn't request this, ignore this email.</p>
                   </div>`, // html body
        };

        const response = await transporter.sendMail(mailOptions);
        console.log(`Verification email sent to ${email}. MessageId: ${response.messageId}`);
        return response;
    } catch (error) {
        console.error('Error sending verification email to', email, error && error.toString ? error.toString() : error);
        // rethrow the original error so caller can handle it or log more details
        throw error;
    }
};

module.exports = { sendverificationcode };