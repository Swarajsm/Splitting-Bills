const express = require("express");
const bodyParser = require("body-parser");

const mongoose = require("mongoose");
const Groups = require("./models/Groups")
const user = require("./models/User");
const transactions = require("./models/Transactions")
const CryptoJS = require("crypto-js");
require("dotenv").config()

require("./startup/db_conn")


//express

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

app.set('view engine', 'ejs');

//Setting up root file for Server at localhost:3000

app.get("/", function(req, res) {
    res.render("login");
});

app.get("/Signup", function(req, res) {
    res.render("Signup");
});

app.get("/groupList", function(req, res) {
    res.render("groupList");
});

app.get("/Profile", function(req, res) {
    res.render("Profile");
});

app.get("/detail", function(req, res) {
    res.render("detail");
});

app.get("/addExpense", function(req, res) {
    res.render("addExpense");
});

app.get("/addGroup", function(req, res) {
    res.render("addGroup");
});

app.get("/settings", function(req, res) {
    res.render("settings");
});



app.post("/", async function(req, res) {
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

    const dbPass = fun[0].password;

    // Decrypt
    var bytes = CryptoJS.AES.decrypt(dbPass, "secret key 10");
    var originalText = bytes.toString(CryptoJS.enc.Utf8);

    if (password === originalText) {
        res.render("groupList")
        isloggedIn = true
        currUser = fun[0].name;
        email = fun[0].email;
    } else {
        res.redirect("/");
    }
});

app.post("/views/Signup", async(req, res) => {
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


    } catch (err) {
        console.log("failed " + err);
        res.render("Signup");
    }
});



app.post("/groupList", async(req, res) => {
    var Groupnm = req.body.groupNm
    var memCount = 1;
    var memberArray = [currUser]
    var groupData = {
        gname: Groupnm,
        members: memCount,
        memberArray: memberArray

    }
    var groupList = fun[0].Groups
    await Groups.create(groupData).catch((err) => {
        console.log(err);
    });
    fun[0].Groups.push(Groupnm)
    await fun[0].save()
    let params = {
        groupList: fun[0].Groups
    }
    res.render("groupList", params)

})



//Post method for Profile page
app.post("views/Profile.ejs", async(req, res) => {
    let params = {
        fcurrUser: currUser,
        email: fun[0].email
    }
    res.render('Profile', params)


})

app.post("/views/detail", async function(req, res) {
    var search = req.body.uname
    var searchData = {
        email: search
    }
    var stu = await user.find(searchData).catch((e) => {
        console.log(e)
    })
    console.log(stu)


})

//Setting up our server at port 3000
app.listen(3000, function(req, res) {
    console.log("Server Started on Port 3000");
});

app.post("/", async function(req, res) {
    var email = req.body.email;
    var password = req.body.pass;

    // Encrypt
    var ciphertext = CryptoJS.AES.encrypt(password, "secret key 10").toString();

    const formData = {
        email: email,
        //pass: password
    };
    var fun = await user.find(formData).catch((err) => {
        console.log(err);
    });
    console.log(fun)
    const dbPass = fun[0].password;

    // Decrypt
    var bytes = CryptoJS.AES.decrypt(dbPass, "secret key 10");
    var originalText = bytes.toString(CryptoJS.enc.Utf8);

    if (password === originalText) {
        res.render("groupList")
        isloggedIn = true
        currUser = fun[0].name;
        email = fun[0].email;
    } else {
        res.redirect("/");
    }
});


app.post("/views/Signup", async(req, res) => {
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


    } catch (err) {
        console.log("failed " + err);
        res.render("Signup");
    }
});

// app.post("/addExpense", async function(req, res) {
//     var title = req.body.BillName
//     var totalAmount = req.body.totAmount
//     var participants = req.body.people

//     var expense = {
//         title: title,
//         amount: totalAmount,
//         memberArray: 
//     }
// });

app.post("/addExpense", async function(req, res) {
    const member = ["Swaraj", "Stuti", "Sanskar"];
    var participants = []

});