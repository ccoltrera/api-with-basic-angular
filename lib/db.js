"use strict";

var mongoose = require("mongoose");
mongoose.connect(process.env.MONGO_URL || "mongodb://localhost:27017");

var db = mongoose.connection;
db.on("error", function(err) {
  console.log("Connection error:", err);
});
db.once("open", function() {
  console.log("Database connected.");
});

module.exports = db;
