"use strict";

var handler = require(__dirname + "/handler");

var router = {
  entry: {
    POST: handler.postEntry,
    title: {
      GET: handler.getEntryByTitle,
      PUT: handler.putEntryByTitle,
      DELETE: handler.deleteEntryByTitle
    }
  },
  vote: {
    title: {
      POST: handler.incrementVotesByTitle
    }
  }
};

module.exports = router;
