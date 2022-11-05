////
const express = require("express");
const bodyParser = require("body-parser");
const bcrypt = require("bcrypt");
const mongoose = require("mongoose");
const Groups = require("./models/Groups")
const user = require("./models/User");
const CryptoJS = require("crypto-js");
require("dotenv").config()
const Atlas = process.env.DB_URI

////////
var isloggedIn = false
/////
mongoose.connect(
  Atlas,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }
);
var db = mongoose.connection;
let dbemail = db.collection("user");
db.on("error", console.log.bind(console, "connection error"));
db.once("open", function (callback) {
  console.log("connection succeeded");
});
// express
///////
const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

//Setting up root file for Server at localhost:3000

app.get("/", function (req, res) {
  res.sendFile(__dirname + "/login.html");
});


var fun = {};
//Post method for login form at "/"

app.post("/", async function (req, res) {
  var email = req.body.email;
  var password = req.body.pass;

  // Encrypt
  var ciphertext = CryptoJS.AES.encrypt(password, "secret key 10").toString();

  const formData = {
    email: email,
    //pass: password
  };
  fun = await user.find(formData).catch((err) => {
    console.log(err);
  });
  console.log(fun)
  const dbPass = fun[0].password;

  // Decrypt
  var bytes = CryptoJS.AES.decrypt(dbPass, "secret key 10");
  var originalText = bytes.toString(CryptoJS.enc.Utf8);

  if (password === originalText) {
    res.redirect("/html/groupList.html");
    isloggedIn = true
  } else {
    res.redirect("/");
  }
});

//Post Method for Registration Form
app.post("/Signup.html", async (req, res) => {
  try {
    const fname = req.body.fname;
    const lname = req.body.lname;
    const email = req.body.email;
    var pass = req.body.pass;

    // Encrypt
    var dbciphertext = CryptoJS.AES.encrypt(pass, "secret key 10").toString();

    //const hashedPass = await bcrypt.hash(pass, 10);
    var userdata = {
      name: fname + " " + lname,
      email: email,
      password: dbciphertext,
    };
    
    await user.create(userdata).catch((err) => {
      console.log(err);
    });
    res.redirect("/")

    
  }catch (err) {
    console.log("failed " + err);
    res.redirect("/Signup.html");
  }
});

app.post("/html/groupList.html", async(req, res)=>{
  var gName = req.body.groupNm
  var groupData = {
    gname: gName,
    members: 1
  };
  await Groups.create(groupData).catch((err) => {
    console.log(err);
  });

})

//Post method for Profile page
app.post("/html/Profile.html", async(req, res) => {
    
    

})


//Setting up our server at port 3000
app.listen(3000, function (req, res) {
  console.log("Server Started on Port 3000");
});
