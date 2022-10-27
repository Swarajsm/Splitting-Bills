const express = require("express");
const bodyParser =  require("body-parser");
const bcrypt = require("bcrypt");
const mongoose  = require('mongoose');

const user = require("./models/User")

var fname, lname, email;

mongoose.connect('mongodb+srv://admin:1234@cluster0.vwzmikm.mongodb.net/?retryWrites=true&w=majority', {
    useNewUrlParser : true,
    useUnifiedTopology: true,
});
var db = mongoose.connection;
let dbemail = db.collection('user')
db.on('error', console.log.bind(console, "connection error"));
db.once('open', function(callback){
    console.log("connection succeeded");
})
// express
const app = express();
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

//Setting up root file for Server at localhost:3000

app.get("/", function(req, res){
    
    res.sendFile(__dirname + "/login.html");
})

//Post method for login form at "/" 

app.post("/",async function(req, res){
    var email = req.body.email
    var password = req.body.pass
    formHashedPass = await bcrypt.hash(password, 10);
    const formData= {
        email: email,
        //pass: password
    }
    
    const fun = await user.find(formData).catch((err)=>{console.log(err)})
    console.log(fun)
    const dbPass = fun[0].password
    console.log(dbPass)
    console.log(formHashedPass)
    if(formHashedPass === dbPass){
        res.redirect("/html/groupList.html")
    }else{
        res.redirect("/")
    }
        

});

//Post Method for Registration Form
app.post("/Signup.html",async (req, res)=>{
    try{
    fname = req.body.fname;
    lname = req.body.lname;
    email = req.body.email;
    var pass = req.body.pass;
    const hashedPass = await bcrypt.hash(pass, 10);
    var userdata ={
        
        "name" : fname +" "+ lname,
        "email": email,
        "password": hashedPass
    }
    /**
     db.collection('user').insertOne(userdata,function(err, collection){
         if (err) throw err;
        console.log("Record inserted Successfully");
              
     });
     */
     
    await user.create(userdata).catch((err)=>{console.log(err)});
    
    return res.redirect('/');
    }
    catch(err){
        
        console.log("failed "+ err)
        res.redirect('/Signup.html')
    }
})

app.post("/html/addGroup.html",(req, res)=>{
    var name = req.body.groupname;
    const Groups = []
    Groups.add(name);
    db.collection("groups").insertOne(name,function(err, collection){
        if(err) throw err;
        console.log("Group Entry Succesful")
    });
})

app.get("/scripts/GroupList.js",function(req, res){
    console.log(Groups);
})


//Setting up our server at port 3000
app.listen(3000, function(req, res){
    console.log("Server Started on Port 3000");
})