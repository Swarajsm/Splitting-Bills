const express = require("express");
const bodyParser = require("body-parser");

const Groups = require("./models/Groups");
const user = require("./models/User");
const transactions = require("./models/Spending");
const CryptoJS = require("crypto-js");
require("dotenv").config();

require("./startup/db_conn");

//express

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

app.set("view engine", "ejs");

//Setting up root file for Server at localhost:3000

app.get("/", async function(req, res) {
    var gList = await Groups.findById(req.params.id);
    res.render("login"), { gList: gList };
});

app.get("/Signup", function(req, res) {
    res.render("Signup");
});

app.get("/groupList", async function(req, res) {
    var gList = await Groups.find();
    res.render("groupList", gList);
});

app.get("/Profile/:id", async function(req, res) {
    const User = await user.findById(req.params.id);
    res.render("Profile", { User: User });
});

app.get("/Group/:id", async function(req, res) {
    const Group = await Groups.findById(req.params.id);
    res.render("detail", { Group: Group });
});

app.get("/addExpense", function(req, res) {
    member = ["Swaraj", "Stuti", "Mayank", "Rishika"]
    res.render("addExpense", { member: member });
});

app.get("/addGroup", function(req, res) {
    res.render("addGroup");
});

app.get("/settings", function(req, res) {
    res.render("settings");
});

app.get("/detail", async function(req, res) {});
var currUser = " ";
var currUserID = "";
var userGroup = [];
var currUserEmail = "";

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

    var bytes = CryptoJS.AES.decrypt(dbPass, "secret key 10");
    var originalText = bytes.toString(CryptoJS.enc.Utf8);

    if (password === originalText) {
        res.render("groupList");
        isloggedIn = true;
        currUser = fun[0].name;
        currUserID = fun[0].id;
        currUserEmail = fun[0].email;
        userGroup = [];
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
        res.redirect("/");
    } catch (err) {
        console.log("failed " + err);
        res.render("Signup");
    }
});

app.post("/groupList", async(req, res) => {
    var Groupnm = req.body.groupNm;
    var memCount = 1;
    var memberArray = [currUserID];
    var data = {
        email: currUserEmail,
    };
    fun = await user.find(data).catch((err) => {
        console.log(err);
    });
    fun[0].Groups.forEach((item) => {
        userGroup.push(item);
    });
    var groupData = {
        gname: Groupnm,
        members: memCount,
        memberArray: memberArray,
    };

    var newG = await Groups.create(groupData).catch((err) => {
        console.log(err);
    });
    fun[0].Groups.push(newG.gname);
    fun[0].GroupsOid.push(newG._id);

    await fun[0].save();
    res.render("/groupList", {
        groupList: userGroup,
    });
});
//Post method for Profile page
app.post("views/Profile.ejs", async(req, res) => {
    let params = {
        fcurrUser: currUser,
        email: fun[0].email
    }
    res.render('Profile', params)


});

app.post("/views/detail", async function(req, res) {
    var search = req.body.uname
    var searchData = {
        email: search
    }
    var stu = await user.find(searchData).catch((e) => {
        console.log(e)
    })
    console.log(stu)


});

app.post("Groups/:id", async function(req, res) {
    const Group = await Groups.findById(req.params.id);
    res.render("detail", { Group, Group });
});

//Setting up our server at port 3000
app.listen(3000, function(req, res) {
    console.log("Server Started on Port 3000");
});

app.post("/addexpense", async function(req, res) {
    var title = req.body.BillName;
    const member = ["Swaraj", "Stuti", "Mayank", "Rishika"];
    var participants = []
    var billAmount = req.body.totAmount;
    var DateOfTransaction = req.body.date;
    var bill = {
        title: title,
        amount: billAmount,
        participants: participants,
        dateOfTransaction: DateOfTransaction,
    };
    await transactions.create(bill).catch((e) => {
        console.log(e);
    });
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