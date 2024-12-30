const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    phonenumber: { type: String, required: true },
    socketId: { type: String },
    isVerified: { type: Boolean, default: false },
    verificationcode: { type: String },
    photo: { type: String },
    addwork: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Addwork' }],
    location: {
        type: { type: String, default: 'Point' },
        coordinates: { type: [Number], required: true }, // Add this line to store coordinates
        address: { type: String, required: true }         // Add this line to store the address
    }
});

const User = mongoose.model('User', userSchema);
module.exports = User;
