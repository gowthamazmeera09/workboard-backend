const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true
    },
    phonenumber:{
        type:String,
        required:true
    },
    isVerified: {
        type: Boolean,
        default: false // New users will not be verified initially
    },
    verificationcode: {
        type: String // This will hold the token used for email verification
    },
    imageUrl: { type: String, required: true },
})
const User = mongoose.model('User',userSchema)
module.exports = User;