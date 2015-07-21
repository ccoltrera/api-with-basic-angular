"use strict";
var url = require("url");

var express = require("express");
var bodyParser = require("body-parser");
var app = express();
app.use(bodyParser.json());

var db = require(__dirname + "/lib/db");
var Entry = require(__dirname + "/lib/model");

app.route("/api/entry")
  .post(function(req, res) {
    //Check if entry a duplicate by title
    Entry.find({title: req.body.title}, function(err, entries) {

      if (entries.length === 0) {
        var reqEntry = new Entry(req.body);
        reqEntry.save(function(err, reqEntry) {
          if (err) {
            console.log(err);
            res.sendStatus(500);
          } else {
            res.sendStatus(200);
          }
        });
      } else {
        res.sendStatus(409);
      }
    });
  });

app.route("/api/entry/:title")
  .get(function(req, res) {
    //Decode the URI encoded title
    var entryTitle = decodeURIComponent(req.params.title);
    Entry.find({title: entryTitle}, function(err, entries) {
      if (entries.length === 0) {
        res.sendStatus(404);
      } else {
        res.json(entries[0]);
      }
    });
  })
  .put(function(req, res) {
    //Decode the URI encoded title
    var entryTitle = decodeURIComponent(req.params.title);
    Entry.find({title: entryTitle}, function(err, entries) {
      if (entries.length === 0) {
        var reqEntry = new Entry(req.body);
        reqEntry.save(function(err, reqEntry) {
          if (err) {
            console.log(err);
            res.sendStatus(500);
          } else {
            res.sendStatus(201);
          }
        });
      } else {
        Entry.findOneAndUpdate({title: entryTitle}, req.body, {overwrite: true}, function(err) {
          if (err) {
            res.sendStatus(500);
          } else {
            res.sendStatus(200);
          }
        });
      }
    });
  })
  .delete(function(req, res) {
    var entryTitle = decodeURIComponent(req.params.title);
    Entry.find({title: entryTitle}, function(err, entries) {
      if (entries.length === 0) {
        res.sendStatus(400);
      } else {
        Entry.remove({title: entryTitle}, function(err) {
          if (err) {
            res.sendStatus(500);
          } else {
            res.sendStatus(200);
          }
        });
      }
    });
  });

app.route("/api/vote/:title")
  .patch(function(req, res) {
    var entryTitle = decodeURIComponent(req.params.title);
    Entry.find({title: entryTitle}, function(err, entries) {
      if (entries.length === 0) {
        res.sendStatus(400);
      } else {
        Entry.update({title: entryTitle}, {$inc: {votes: 1}}, function(err) {
          if (err) {
            res.sendStatus(500);
          } else {
            res.sendStatus(200);
          }
        });
      }
    });

  });

var apiServer = app.listen(8080, function() {
  console.log("Server running on http://localhost:8080");
});

module.exports = apiServer;
