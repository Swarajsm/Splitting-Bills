const express = require("express");
const bodyParser =  require("body-parser");

const mongoose  = require('mongoose');
mongoose.connect('mongodb://localhost:27017/Fypro')
var db = mongoose.connection;
db.on('error', console.log.bind(console, "connection error"));
db.once('open', function(callback){
    console.log("connection succeeded");
})
var path = require('path')
const app = express();
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));
app.get("/", function(req, res){
    
    res.sendFile(__dirname + "/login.html");
})
app.post("/",function(req, res){
    var email = req.body.email;
    var pass = req.body.pass;

    var data = {
        "email": email,
        "password": pass
    }
    db.collection('user').findOne(data, function(err, collection){
        if (err) throw err;
        return res.redirect('/html/newgroup.html');
    })
})
app.post("/Signup", function(req, res){
    var fname = req.body.fname;
    var lname = req.body.lname;
    var email = req.body.email;
    var pass = req.body.pass;
    
    var userdata ={
        "name" : fname +" "+ lname,
        "email": email,
        "password": pass
    }

    db.collection('user').insertOne(userdata,function(err, collection){
        if (err) throw err;
        console.log("Record inserted Successfully");
              
    });
    return res.redirect('/');
    
})


app.listen(3000, function(req, res){
    console.log("Server Started on Port 3000");
})