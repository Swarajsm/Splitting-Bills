const mongoose  = require('mongoose');
const Groups = mongoose.model("Groups",new mongoose.Schema({
    "gname": {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 50
    },
    
    "members":{
        type: String,
        required: true,
    },
    "memberArray":{
        type: Array,
        minLength: 1
    
    }

})
);
module.exports = Groups;