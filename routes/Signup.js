const express = require("express");
const bodyParser = require("body-parser");

const mongoose = require("mongoose");
const user = require("../models/User");

const app = express()


app.post("/views/Signup", async (req, res) => {
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
      res.render("Signup");
    }
  });