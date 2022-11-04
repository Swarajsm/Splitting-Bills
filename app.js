const express = require("express");
const bodyParser = require("body-parser");
const bcrypt = require("bcrypt");
const mongoose = require('mongoose');

const user = require("./models/User")
const CryptoJS = require("crypto-js");
const { response } = require("express");

var fname, lname, email, name;

mongoose.connect('mongodb+srv://admin:1234@cluster0.vwzmikm.mongodb.net/?retryWrites=true&w=majority', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});
var db = mongoose.connection;
let dbemail = db.collection('user')
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

app.post("/", async function(req, res) {
    var email = req.body.email
    var password = req.body.pass

    // Encrypt
    var ciphertext = CryptoJS.AES.encrypt(password, 'secret key 10').toString();

    const formData = {
        email: email,
        //pass: password
    }
    const fun = await user.find(formData).catch((err) => { console.log(err) })
    const dbPass = fun[0].password

    // Decrypt
    var bytes = CryptoJS.AES.decrypt(dbPass, 'secret key 10');
    var originalText = bytes.toString(CryptoJS.enc.Utf8);

    if (password === originalText) {
        res.redirect("/html/groupList.html")
        var isLoggedIn = true;

    } else {
        res.redirect("/")
    }

});

//Post Method for Registration Form
app.post("/Signup.html", async(req, res) => {
    try {
        fname = req.body.fname;
        lname = req.body.lname;
        email = req.body.email;
        var pass = req.body.pass;

        // Encrypt
        var dbciphertext = CryptoJS.AES.encrypt(pass, 'secret key 10').toString();

        //const hashedPass = await bcrypt.hash(pass, 10);
        var userdata = {

                "name": fname + " " + lname,
                "email": email,
                "password": dbciphertext
            }
            /**
             db.collection('user').insertOne(userdata,function(err, collection){
                 if (err) throw err;
                console.log("Record inserted Successfully");
                      
             });
             */

        await user.create(userdata).catch((err) => { console.log(err) });

        // return res.redirect('/');
    } catch (err) {

        console.log("failed " + err)
        res.redirect('/Signup.html')
    }
})

app.post("/html/addGroup.html", (req, res) => {
    var name = req.body.groupname;
    const Groups = []
    Groups.add(name);
    db.collection("groups").insertOne(name, function(err, collection) {
        if (err) throw err;
        console.log("Group Entry Succesful")
    });
})

app.get("/scripts/GroupList.js", function(req, res) {
    console.log(Groups);
})



//Setting up our server at port 3000
app.listen(3000, function(req, res) {
    console.log("Server Started on Port 3000");
})