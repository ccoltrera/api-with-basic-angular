"use strict";
var url = require("url");

var express = require("express");
var bodyParser = require("body-parser");
var app = express();
app.use(bodyParser.json());
app.use(express.static(__dirname + "/public"));

var db = require(__dirname + "/lib/db");
var router = require(__dirname + "/lib/router");

app.route("/api/entry")
  .post(router.entry.POST);

app.route("/api/entry/:title")
  .get(router.entry.title.GET)
  .put(router.entry.title.PUT)
  .delete(router.entry.title.DELETE);

app.route("/api/vote/:title")
  .post(router.vote.title.POST);

var apiServer = app.listen(8080, function() {
  console.log("Server running on http://localhost:8080");
});

module.exports = apiServer;
