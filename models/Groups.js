const mongoose = require('mongoose');
const Groups = mongoose.model("Groups", new mongoose.Schema({
    "gname": {
        type: String,
        required: true,
        minlength: 1,
        maxlength: 50
    },

    "members": {
        type: String,
        required: true,
    },
    "memberArray": {
        type: Array,
        minLength: 1
    },
    "transaction": {
        type: Array,

    }

}));
module.exports = Groups;