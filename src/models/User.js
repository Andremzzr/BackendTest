const mongoose = require("mongoose");


const UserSchema = new mongoose.Schema({
    name : {
        type: String,
        required: true
    },
    email : {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true
    },
    points: {
        type: Number,
        default: 0
    },
    userHash: {
        type: String,
        required: true
    },
    comfirmed: {
        type: Boolean,
        default : false
    }
},{collection: 'user'});


const User = mongoose.model('User', UserSchema);

module.exports = User;