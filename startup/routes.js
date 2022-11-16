const express = require("express");
var indexRouter = require("../routes/index");
var router1Router = require("../routes/router1");
var router2Router = require("../routes/router2");

module.exports = function(app) {
  app.use(express.json());

  app.use("/", login);
  app.use("/Signup", Signup);
}; 