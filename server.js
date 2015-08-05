"use strict";
var url = require("url");

var express = require("express");
var bodyParser = require("body-parser");
var app = express();
app.use(bodyParser.json());
app.use(express.static(__dirname + "/public"));

var db = require(__dirname + "/lib/db");
var router = require(__dirname + "/lib/router");

app.route("/api/entries/:id")
  .get(router.entries.id.GET)
  .put(router.entries.id.PUT)
  .delete(router.entries.id.DELETE);

app.route("/api/entries")
  .post(router.entries.POST)
  .get(router.entries.GET);

app.route("/api/votes/:id")
  .post(router.votes.id.POST);

var apiServer = app.listen(8080, function() {
  console.log("Server running on http://localhost:8080");
});

module.exports = apiServer;
