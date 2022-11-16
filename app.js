const express = require("express");
const bodyParser = require("body-parser");

const mongoose = require("mongoose");
const Groups = require("./models/Groups")
const user = require("./models/User");
const transactions = require("./models/Transactions")
const CryptoJS = require("crypto-js");
require("dotenv").config()
const Atlas = process.env.DB_URI

require("./routes/login")
require("./routes/Signup")

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
// express

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

app.set('view engine', 'ejs');

//Setting up root file for Server at localhost:3000

app.get("/", function (req, res) {
  res.render("login");
});


var fun = {};

app.post("/groupList", async(req, res)=>{
 
  
})



//Post method for Profile page
app.post("views/Profile.ejs", async(req, res) => {
    let params ={
      fcurrUser: currUser
    }
    res.render('Profile',params)
    

})

app.post("/html/detail.html", async function(req, res){
    var userref = req.body.uname;
    formData={
      email: userref
    }


    var sun = await user.find(formData).catch((err) => {
      console.log(err);
    });
    sun[0].Groups.push()

})

//Setting up our server at port 3000
app.listen(3000, function (req, res) {
  console.log("Server Started on Port 3000");
});
