const mongoose = require('mongoose');
const Transactions = mongoose.model("Transactions", new mongoose.Schema({
    "title": {
        type: String,
        required: true,
        minlength: 1,
        maxlength: 50
    },

    "amount": {
        type: String,
        required: true,

    },

    "memberArray": {
        type: Array,
        minLength: 1,
        required: true
    },
    "dateOfTransaction": {
        required: true,
        type: Date
    }

}));
module.exports = Transactions;