const { array } = require('i/lib/util');
const mongoose  = require('mongoose');
const User = mongoose.model("user",new mongoose.Schema({
    "name": {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 50
    },
    "email": {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 255,
        unique: true
    },
    "password": {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 1024
    },
    "Groups": {
        type: Array,
        required: true
        
    }
})
);
module.exports =  User;