
const mongoose = require("mongoose");
const Atlas = process.env.DB_URI
mongoose.connect(
    Atlas,
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  );
  var db = mongoose.connection;
  db.on("error", console.log.bind(console, "connection error"));
  db.once("open", function (callback) {
    console.log("connection succeeded");
  });