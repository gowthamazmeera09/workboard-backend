const mongoose = require('mongoose');

const addworkSchema = new mongoose.Schema({
    role: {
        type: String,
        required: true,
        enum: ['teacher', 'driver', 'painter', 'mason', 'marbul', 'plumber', 'electrician', 'welder']
    },
    experience: {
        type: Number,
        required: true
    },
    location: {
        type: String,
        required: true
    },
    weldingtype: {
        type: String,
        enum: ['fabrication', 'gaswelding', 'arcwelding']
    },
    marbultype: {
        type: String,
        enum: ['marbul', 'tiles', 'granite', 'hardwood', 'stone']
    },
    standard: {
        type: String,
        enum: ['1st', '2nd', '3rd', '4th', '5th', '6th', '7th', '8th', '9th', '10th', 'All']
    },
    subject: {
        type: String
    },
    vehicletype: {
        type: String,
        enum: ['bike', 'scooty', 'auto', 'appiauto', '5-seat-car', '7-seat-car', 'tractor', 'bus', 'lorry']
    },
    paintertype: {
        type: String,
        enum: ['interior', 'exterior', 'drawing', 'furniture', 'others']
    },
    photos: [{
        type: String
    }],
    user: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }]
});

const Addwork = mongoose.model('Addwork', addworkSchema);
module.exports = Addwork;
