const mongoose = require('mongoose');
const ledger = mongoose.model("ledger", new mongoose.Schema({
    "lender": {
        type: String,
        required: true
    },
    "borrower": {
        type: Array,
        required: true
    },
    "amount": {
        type: Number,
        required: true
    },
    "date": {
        type: String,
        required: true
    }
}));
module.exports = ledger;