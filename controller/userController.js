const { sendverificationcode } = require('../middleware/Email');
const User = require('../model/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const dotEnv = require('dotenv');

dotEnv.config();

const secretkey = process.env.MyNameIsMySecretKey;

const userRegister = async(req, res) => {
    const { username, email, password, phonenumber } = req.body;
    try {
        const userEmail = await User.findOne({ email });
        if (userEmail) {
            return res.status(400).json({ error: "email already taken" });
        }
        const userphonenumber = await User.findOne({ phonenumber });
        if (userphonenumber) {
            return res.status(400).json({ error: "phonenumber already taken" });
        }
        const hashedpassword = await bcrypt.hash(password, 10);
        const verificationcode = Math.floor(100000 + Math.random() * 900000).toString();

        const newuser = new User({
            username,
            email,
            password: hashedpassword,
            phonenumber,
            verificationcode
        });
        await newuser.save();

        // Send verification email
        await sendverificationcode(newuser.email, verificationcode);

        res.status(200).json({ success: "Registration successful! Please verify your email.", newuser });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error" });
    }
}
const verifyEmail = async(req, res)=>{
    try {
        const {code} = req.body
        const user = await User.findOne({verificationcode:code});
        if(!user){
            return res.status(404).json({error:"user not found"})
        }
        user.isVerified = true;
        user.verificationcode = undefined;
        await user.save();
        res.status(201).json({message:"Email verified successfully"})
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error" });
        
    }
}

const userLogin = async(req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(401).json({ error: "invalid email or password" });
        }
        if (!user.isVerified) {
            return res.status(403).json({ error: "Please verify your email before logging in" });
        }
        const token = jwt.sign({ userId: user._id }, secretkey, { expiresIn: "1h" });
        res.status(200).json({ success: "Login successfully", token, userId: user._id });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error" });
    }
}

module.exports = { userRegister, userLogin, verifyEmail};
