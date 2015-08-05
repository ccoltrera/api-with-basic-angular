"use strict";
var url = require("url");

var express = require("express");
var bodyParser = require("body-parser");
var app = express();
app.use(bodyParser.json());
app.use(express.static(__dirname + "/public"));

var db = require(__dirname + "/lib/db");
var router = require(__dirname + "/lib/router");

app.route("/api/entries/:title")
  .get(router.entries.title.GET)
  .put(router.entries.title.PUT)
  .delete(router.entries.title.DELETE);

app.route("/api/entries")
  .post(router.entries.POST)
  .get(router.entries.GET);

app.route("/api/votes/:title")
  .post(router.votes.title.POST);

var apiServer = app.listen(8080, function() {
  console.log("Server running on http://localhost:8080");
});

module.exports = apiServer;
