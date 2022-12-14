const express = require("express");
const bodyParser = require("body-parser");
const Ledger = require("./models/ledger")
const Groups = require("./models/Groups");
const user = require("./models/User");
const transactions = require("./models/Spending");
const CryptoJS = require("crypto-js");

const ledgerbook = require("./models/ledgerbook");

require("dotenv").config();
require("./startup/db_conn");

//express

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

app.set("view engine", "ejs");

//Setting up root file for Server at localhost:3000

app.get("/detail", async function(req, res) {
    const Group = await Groups.findById(req.params.id)
    res.render("detail", { Group: Group })
})
app.get("/", async function(req, res) {
    var gList = await Groups.findById(req.params.id);
    message = "Incorrect Password. Please try again.";
    res.render("Auth"), { gList: gList };
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

    TransactionsList = Group.transaction
    transactionIDs = Group.transactionIDs
    TransactionsAmt = Group.Amounts
    id = Group._id
    parameters = {
        Group: Group,
        Transactions: TransactionsList,
        TransactionsAmt: TransactionsAmt,
        id: id
    }
    res.render("detail", parameters);
});

app.get("/addMember/:id", async function(req, res) {
    const Group = await Groups.findById(req.params.id)
    TransactionsList = Group.transaction
    TransactionsAmt = Group.Amounts

    parameters = {
        Group: Group,
        Transactions: TransactionsList,
        TransactionsAmt: TransactionsAmt
    }
    res.render("detail", parameters);

})
app.get("/groupList", async function(req, res) {
    userGroup = fun[0].Groups
    res.render("/groupList", { userGroup: userGroup })
})
app.get("/addExpense/:id", async function(req, res) {
    const Group = await Groups.findById(req.params.id)

    member = Group.MemberOids
    TransactionsList = Group.transaction
    TransactionsAmt = Group.Amounts
    parameters = {
        Group: Group,
        Transactions: TransactionsList,
        TransactionsAmt: TransactionsAmt
    }

    res.render("addExpense", parameters);
});


app.get("/settings", function(req, res) {
    res.render("settings");
});

app.get("/notifications/:id", async function(req, res) {
    const search = {
        lender: req.params.id,

    }
    result = await ledgerbook.find(search)
    var borrowerName = []
    var amounts = []
    for (var i = 0; i < result.length; i++) {
        borrower = await user.findById(result[i].borrower)
        borrowerName.push(borrower.name)
        amounts.push(result[i].Total)
    }
    const paramaters = {
        result: result,
        borrowers: borrowerName,
        Total: amounts
    }
    res.render("notifications", paramaters)
})

app.get("/settleup/:id", async function(req, res) {
    const lenden = await ledgerbook.findById(req.params.id)
    console.log(lenden)
    b = await user.findById(lenden.borrower)
    bname = b.name
    console.log(bname)
    const params = {
        Total: lenden.Total,
        borrower: bname,
    }
    res.render("settleup", params)
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
    } else {
        res.render("flogin");
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
            Balance: 0
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
    var memberArray = [currUser];
    var MemberOids = [currUserID]
    spendings = []
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
        transactions: transactions,
        MemberOids: MemberOids
    };

    var newG = await Groups.create(groupData).catch((err) => {
        console.log(err);
    });
    fun[0].Groups.push(newG.gname);
    fun[0].GroupsOid.push(newG._id);

    await fun[0].save();
    res.render("groupList", {
        groupList: userGroup,
    });
});
//Post method for Profile page
app.post("Profile", async(req, res) => {
    let params = {
        fcurrUser: currUser,
        email: fun[0].email
    }
    res.render('Profile', params)


});

app.post("/addMember/:id", async function(req, res) {
    const Group = await Groups.findById(req.params.id);
    username = req.body.uname
    formdataa = {
        email: username
    }
    find = await user.exists(formdataa)
    newv = await user.find(formdataa).catch((e) => {
        console.log(e);
    })

    if (find) {

        Group.memberArray.push(newv[0].name)
        Group.MemberOids.push(newv[0]._id)
        newv[0].Groups.push(Group.gname)
        newv[0].GroupsOid.push(Group.id)
        await newv[0].save()
        await Group.save()
    } else {
        message = req.flash('error', 'user does not exist')
            //alert("user does not exist")
    }

    res.render("detail", { Group: Group, message: message })

});
app.post("/addExpense/:id", async function(req, res) {
    var title = req.body.BillName;
    const Group = await Groups.findById(req.params.id)
    var memberArray = Group.memberArray

    var billAmount = req.body.totAmount;
    var DateOfTransaction = req.body.date.toLocaleString()
    var bill = {
        title: title,
        amount: billAmount,
        participants: memberArray,
        dateOfTransaction: DateOfTransaction,
    };
    newBill = await transactions.create(bill).catch((e) => {
        console.log(e);
    });
    var participants = memberArray.length
    var partition = billAmount / participants
    newBalance = fun[0].Balance + (partition * (participants - 1))
    borrowers = []
    for (var i = 0; i < participants; i++) {
        var u = await user.findById(Group.MemberOids[i])


        if (Group.MemberOids[i] != fun[0]._id) {
            var nB = u.Balance - partition
            await user.findByIdAndUpdate(fun[0]._id, { Balance: newBalance })
            await user.findByIdAndUpdate(Group.MemberOids[i], { Balance: nB })
            borrowers.push(Group.MemberOids[i])
        }
    }


    Group.transaction.push(newBill.title)
    Group.transactionIDs.push(newBill._id)
    Group.Amounts.push(newBill.amount)
    await Group.save()
    var newLedger = {
        lender: fun[0]._id,
        borrower: borrowers,
        amount: partition,
        date: DateOfTransaction
    }
    newLedger = await Ledger.create(newLedger).catch((e) => {
        console.log(e)
    })
    fun[0].Lendings.push(newLedger.id)
    fun[0].save()

    const us = await user.findById(fun[0]._id)
    const l = newLedger.borrower



    var amount = newLedger.amount
    for (var j = 0; j < l.length; j++) {
        var data = {
            borrower: l[j],
            Total: amount,
            lender: newLedger.lender
        }
        var check = {
            borrower: l[j],
            lender: newLedger.lender
        }
        var check1 = {
            borrower: l[j],

        }
        var check2 = {
            lender: newLedger.lender
        }
        c = await ledgerbook.exists(check1)
        c2 = await ledgerbook.exists(check2)

        if (c) {
            if (c2) {
                x = await ledgerbook.find(check)
                console.log(x)
                console.log("-- -- --")
                x.Total = newLedger.amount + x.Total

                await ledgerbook.updateOne(check, { $inc: { Total: newLedger.amount } })
            }

        } else {
            await ledgerbook.create(data).catch((e) => {
                console.log(e)
            })
        }
    }



    res.render("detail", { Group: Group, id: id })
});

app.get('*', function(req, res) {
    res.status(404).render("notfound");
});
//Setting up our server at port 3000
app.listen(3000, function(req, res) {
    console.log("Server Started on Port 3000");
});