const express = require("express");
const bodyParser = require("body-parser");
const bcrypt = require("bcrypt");

const passport = require("passport");
const initializePassport = require('./passport-config')
initializePassport(passport,
    email => db.collection.users.find(user => user.email === email),
    id => users.find(user => user.id === id))

//Mongo DB related stuff
const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/Fypro')
var db = mongoose.connection;
let dbemail = db.collection("user")
db.on('error', console.log.bind(console, "connection error"));
db.once('open', function(callback) {
        console.log("connection succeeded");
    })
    // express
const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

//Setting up root file for Server at localhost:3000
app.get("/", function(req, res) {

    res.sendFile(__dirname + "/login.html");
})

//Post method for login form at "/" 
app.post("/", function(req, res) {
    var email = req.body.email;
    var pass = req.body.pass;

    var data = {
        "email": email,
        "password": pass
    }
    db.collection('user').findOne(data, function(err, collection) {
        if (err) throw err;
        return res.redirect('/html/groupList.html');
    })
})

//Post Method for Registration Form
app.post("/Signup.html", async(req, res) => {
    try {
        var fname = req.body.fname;
        var lname = req.body.lname;
        var email = req.body.email;
        var pass = req.body.pass;
        const hashedPass = await bcrypt.hash(pass, 10);

        var userdata = {
            _id: Date.now.toString,
            "name": fname + " " + lname,
            "email": email,
            "password": hashedPass
        }

        db.collection('user').insertOne(userdata, function(err, collection) {
            if (err) throw err;
            console.log("Record inserted Successfully");

        });
        return res.redirect('/');
    } catch {
        console.log("failed")
        res.redirect('/Signup.html')
    }
})

app.post("/groupList.html", (req, res) => {
    var GName = req.body.groupNm

});


//Setting up our server at port 3000
app.listen(3000, function(req, res) {
    console.log("Server Started on Port 3000");
})