const { sendverificationcode } = require('../middleware/Email');
const User = require('../model/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const dotEnv = require('dotenv');
const multer = require('multer');
const path = require('path');
const { v2: cloudinary } = require('cloudinary');
const { CloudinaryStorage } = require('multer-storage-cloudinary');

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

const upload= multer({ storage });

const userRegister = async(req, res) => {
    const { username, email, password, phonenumber } = req.body;
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

        // Create new user with uploaded image data
        const newuser = new User({
            username,
            email,
            password: hashedpassword,
            phonenumber,
            verificationcode,
            photo: photoUrl,
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

const verifyEmail = async(req, res) => {
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

const resendVerificationCode = async(req, res) => {
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

const userLogin = async(req, res) => {
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

const getallusers = async(req, res) => {
    try {
        const users = await User.find().populate('addwork');
        res.json({ users });
    } catch (error) {
        console.log(error);
        res.status(404).json({ error: "Failed to get all users" });
    }
};

const getuserById = async(req, res) => {
    const userId = req.params.id;
    try {
        const user = await User.findById(userId).populate('addwork'); // Make sure this is correctly referencing addwork
        if (!user) {
            return res.status(400).json({ error: "User not found" });
        }
        res.status(201).json({ user });
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


module.exports = {
    userRegister,
    userLogin,
    verifyEmail,
    resendVerificationCode,
    getallusers,
    getuserById,
    getUsersByRole,
    upload
};
