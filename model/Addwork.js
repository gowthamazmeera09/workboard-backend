const mongoose = require('mongoose');

const addworkSchema = new mongoose.Schema({
    workname:{
        type:String,
        required:true
    },
    experience:{
        type:String,
        required:true
    },
    location:{
        type:String,
        required:true
    },
    photos:[{
        data: Buffer,
        Type: String
    }],
    user:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User'
    }]
});
const Addwork = mongoose.model('Addwork',addworkSchema);
module.exports = Addwork;