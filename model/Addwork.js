const mongoose = require('mongoose');

const addworkSchema = new mongoose.Schema({
    role:{
        type:String,
        required:true,
        enum:['teacher','driver','painter','mason','marbul','plumber','electrician','welder','carpenter','AcTech','liftTech',
            'agricultural labour','car mechanic','bike mechanic','auto mechanic','car wash','chief','cloths washer','garden cleaner',
            'glass cleaner','kids caretaker','makeup artest','old people caretaker','photographer','cattering','washing dishes','watchman'
        ]
    },
    experience:{
        type:Number,
        required:true
    },
    weldingtype:{
        type:String,
        enum:['fabrication','gaswelding','arcwelding']
    },
    marbultype:{
        type:String,
        enum:['marbul','tiles','granite','hardwood','stone']
    },
    standard:{
        type:String,
        enum:[
            '1st',
            '2nd',
            '3rd',
            '4th',
            '5th',
            '6th',
            '7th',
            '8th',
            '9th',
            '10th',
            'All'
        ]
    },
    subject:{
        type:String
    },
    vehicletype:{
        type:String,
        enum:[
            'bike',
            'scooty',,
            'auto',
            'appiauto',
            '5-seat-car',
            '7-seat-car',
            'tractor',
            'bus',
            'lorry'
        ]
    },
    paintertype:{
        type:String,
        enum:[
            'interier',
            'exterier',
            'drawing',
            'furniture',
            'others'
        ]
    },
    cartype:{
        type:String,
        enum:[
            'maruthi suzuki',
            'hundai',
            'tata moters',
            'mahindra',
            'honda',
            'toyota',
            'renualt',
            'volkswagan',
            'kia',
            'scoda'
        ]
    },
    biketype:{
        type:String,
        enum:[
            'hero',
            'honda',
            'bajaj',
            'tvs',
            'royal enfield',
            'ktm'
        ]
    },
    autotype:{
        type:String,
        enum:[
            'bajaj',
            'mahindra'
        ]
    },
    shoottype:{
        type:String,
        enum:[
            'prewedding',
            'wedding',
            'postwedding',
            'birthday',
            'shoot'
        ]
    },
    photos: [String],
    user:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User'
    }]
});
const Addwork = mongoose.model('Addwork',addworkSchema);
module.exports = Addwork;