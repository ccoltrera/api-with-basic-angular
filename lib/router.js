"use strict";

var handler = require(__dirname + "/handler");

var router = {
  entries: {
    POST: handler.postEntry,
    GET: handler.getEntries,
    title: {
      GET: handler.getEntryByTitle,
      PUT: handler.putEntryByTitle,
      DELETE: handler.deleteEntryByTitle
    }
  },
  votes: {
    title: {
      POST: handler.incrementVotesByTitle
    }
  }
};

module.exports = router;
