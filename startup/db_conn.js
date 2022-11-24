const mongoose = require("mongoose");
const Atlas = process.env.DB_URI
const localDB = process.env.DATA_BASE
mongoose.connect(
    Atlas, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useNewUrlParser: true,
        useFindAndModify: false,
        useCreateIndex: true
    }
);
var db = mongoose.connection;
db.on("error", console.log.bind(console, "connection error"));
db.once("open", function(callback) {
    console.log("connection succeeded");
});