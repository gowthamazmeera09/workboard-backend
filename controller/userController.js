const { sendverificationcode } = require('../middleware/Email');
const User = require('../model/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const dotEnv = require('dotenv');
const multer = require('multer');
const path = require('path');
const { v2: cloudinary } = require('cloudinary');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const nodemailer = require('nodemailer');






dotEnv.config();

const secretkey = process.env.MyNameIsMySecretKey;

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'workboard',
        allowed_formats: ['jpg', 'jpeg', 'png'],
    },
});

const upload = multer({ storage });

const userRegister = async (req, res) => {
    const { username, email, password, phonenumber, location } = req.body;
    const photoUrl = req.file ? req.file.path : null;

    try {
        const userEmail = await User.findOne({ email });
        if (userEmail) {
            return res.status(400).json({ error: "Email already taken" });
        }
        const userphonenumber = await User.findOne({ phonenumber });
        if (userphonenumber) {
            return res.status(400).json({ error: "Phonenumber already taken" });
        }
        const hashedpassword = await bcrypt.hash(password, 10);
        const verificationcode = Math.floor(100000 + Math.random() * 900000).toString();

        // Parse the location data and save
        const parsedLocation = JSON.parse(location); // Assuming location is passed as JSON string
        const newuser = new User({
            username,
            email,
            password: hashedpassword,
            phonenumber,
            verificationcode,
            photo: photoUrl,
            location: {
                type: 'Point',
                coordinates: [parsedLocation.lng, parsedLocation.lat],
                address: parsedLocation.address
            }
        });
        await newuser.save();

        // Send verification email
        await sendverificationcode(newuser.email, verificationcode);

        res.status(200).json({ success: "Registration successful! Please verify your email.", user: newuser });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error" });
    }
};


const verifyEmail = async (req, res) => {
    try {
        const { code } = req.body;
        const user = await User.findOne({ verificationcode: code });
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }
        user.isVerified = true;
        user.verificationcode = undefined;
        await user.save();
        res.status(201).json({ message: "Email verified successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error" });
    }
};

const resendVerificationCode = async (req, res) => {
    const { email } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }
        if (user.isVerified) {
            return res.status(400).json({ error: "User is already verified" });
        }

        // Generate new verification code
        const verificationcode = Math.floor(100000 + Math.random() * 900000).toString();
        user.verificationcode = verificationcode;
        await user.save();

        // Resend verification email
        await sendverificationcode(user.email, verificationcode);

        res.status(200).json({ success: "Verification code sent" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error" });
    }
};

const userLogin = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(401).json({ error: "Invalid email or password" });
        }
        if (!user.isVerified) {
            return res.status(403).json({ error: "Please verify your email before logging in" });
        }
        const token = jwt.sign({ userId: user._id }, secretkey, { expiresIn: "1h" });


        const photo = user.photo;

        res.status(200).json({ success: "Login successful", token, userId: user._id, photo });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error" });
    }
};

const getallusers = async (req, res) => {
    try {
        const users = await User.find().populate('addwork'); // Populate 'addwork' if needed
        const usersWithLocation = users.map(user => ({
            ...user._doc, // Spread to include the user properties
            location: {
                type: user.location.type,
                coordinates: user.location.coordinates,
                address: user.location.address
            }
        }));
        res.json({ users: usersWithLocation });
    } catch (error) {
        console.log(error);
        res.status(404).json({ error: "Failed to get all users" });
    }
};


const getuserById = async (req, res) => {
    const userId = req.params.id;
    try {
        const user = await User.findById(userId).populate('addwork'); // Populate 'addwork' if needed
        if (!user) {
            return res.status(400).json({ error: "User not found" });
        }
        res.status(201).json({
            user,
            location: {
                type: user.location.type,
                coordinates: user.location.coordinates,
                address: user.location.address
            }
        });
    } catch (error) {
        console.error(error);
        res.status(404).json({ error: "Failed to get the user details" });
    }
};

const getUsersByRole = async (req, res) => {
    const { role } = req.params; // Get role from request params
    try {
        const users = await User.find({ role }); // Filter users by role
        if (!users.length) {
            return res.status(404).json({ error: "No users found for this role" });
        }
        res.status(200).json({ users });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to get users for this role" });
    }
};
const addUserLocation = async (req, res) => {
    const { lat, lng } = req.body;

    try {
        const userId = req.userId; // Assuming userId is available from middleware
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        user.location = {
            type: { type: 'Point', coordinates: [lng, lat] }
        };
        await user.save();

        res.status(200).json({ message: "Location added successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to add location" });
    }
};

const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString();

const requestPasswordReset = async (req, res) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        // Generate and store OTP
        const otp = generateOTP();
        user.resetOTP = otp;
        user.otpExpires = Date.now() + 10 * 60 * 1000; // OTP expires in 10 minutes
        await user.save();

        // Send OTP via email
        await sendverificationcode(user.email, otp);

        res.status(200).json({ success: "OTP sent to email" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error" });
    }
};

const verifyOTP = async (req, res) => {
    try {
        const { email, otp } = req.body;
        const user = await User.findOne({ email });

        if (!user || user.resetOTP !== otp || Date.now() > user.otpExpires) {
            return res.status(400).json({ error: "Invalid or expired OTP" });
        }

        // OTP verified successfully, clear it
        user.resetOTP = undefined;
        user.otpExpires = undefined;
        await user.save();

        res.status(200).json({ success: "OTP verified successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error" });
    }
};


const resetPasswordWithOTP = async (req, res) => {
    try {
        const { email, newPassword } = req.body;
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        // Hash and save the new password
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        user.password = hashedPassword;
        await user.save();

        res.status(200).json({ success: "Password reset successful" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error" });
    }
};



module.exports = {
    userRegister,
    userLogin,
    verifyEmail,
    resendVerificationCode,
    getallusers,
    getuserById,
    getUsersByRole,
    addUserLocation,
    upload,
    requestPasswordReset,
    verifyOTP,
    resetPasswordWithOTP


};
