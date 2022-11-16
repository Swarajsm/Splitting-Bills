const mongoose  = require('mongoose');
const Transactions = mongoose.model("Transactions",new mongoose.Schema({
    "title": {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 50
    },
    "description":{
        type: String,
        required: true,
        minlength: 5,
        maxlength: 100
    },
    "amount":{
        type: String,
        required: true,
        
    },
    
    "memberArray":{
        type: Array,
        minLength: 1
    
    }

})
);
module.exports = Transactions;