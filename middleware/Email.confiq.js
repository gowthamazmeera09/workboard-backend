

const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
      user: "gowthamazmeera@gmail.com",
      pass: "megq wpso xmzp sbpb",
    },
    tls: {
        rejectUnauthorized: false // Disable strict SSL certificate checking
    }
});



const sendEmail = async () => {
    try {
        const info = await transporter.sendMail({
            from: '"Test Sender" <gowthamazmeera@gmail.com>', // sender address
            to: "your-email@example.com", // receiver address
            subject: "Test Email", // Subject line
            text: "This is a test email", // plain text body
            html: "<b>This is a test email</b>", // html body
        });
        console.log("Test email sent successfully:", info);
    } catch (error) {
        console.error("Error sending test email:", error);
    }
};

sendEmail();

module.exports = { transporter };
  
