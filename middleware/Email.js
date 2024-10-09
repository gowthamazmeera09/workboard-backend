const { transporter } = require('./Email.confiq'); // Ensure this path is correct

const sendverificationcode = async (email, verificationcode) => {
    try {
        const response = await transporter.sendMail({
            from: '"work Board 👻" <gowthamazmeera@gmail.com>', // sender address
            to: email, // list of receivers
            subject: "Verify your Email", // Subject line
            text: "Verify your Email", // plain text body
            html: `<b>Your verification code is: ${verificationcode}</b>`, // html body
        });
        console.log("Email sent successfully", response);
    } catch (error) {
        console.error("Error at Email.js:", error);
        throw new Error("Failed to send verification email");
    }
}

module.exports = { sendverificationcode };