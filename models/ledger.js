const mongoose = require('mongoose');
const ledger = mongoose.model("ledger", new mongoose.Schema({
    "lender": {
        type: string,
        required: true
    },
    "borrower": {
        type: string,
        required: true
    },
    "amount": {
        type: Number,
        required: true
    }
}));
module.exports = ledger;