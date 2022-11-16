const express = require("express");

const user = require("../models/User");

const app = express()

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
      res.render("./views/groupList")
      isloggedIn = true
      currUser = fun[0].name;
      email = fun[0].email;
    } else {
      res.redirect("/");
    }
  });
  