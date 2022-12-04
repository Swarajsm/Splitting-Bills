const mongoose = require('mongoose');
const ledgerbook = mongoose.model("ledgerBook", new mongoose.Schema({
    "lender": {
        type: String,
        required: true
    },
    "borrower": {
        type: String,
        required: true
    },

    "Total": {
        type: Number,
        required: true
    },
    "date": {
        type: String,
        required: true
    }
}));
module.exports = ledgerbook;