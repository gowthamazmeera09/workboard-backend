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
    photo:{
        type:String,
        default:"https://media.istockphoto.com/id/1300845620/vector/user-icon-flat-isolated-on-white-background-user-symbol-vector-illustration.jpg?s=612x612&w=0&k=20&c=yBeyba0hUkh14_jgv1OKqIH0CCSWU_4ckRkAoy2p73o="
    },
     addwork:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User'
    }]
})
const User = mongoose.model('User',userSchema)
module.exports = User;
