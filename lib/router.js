"use strict";

var handler = require(__dirname + "/handler");

var router = {
  entries: {
    POST: handler.postEntry,
    GET: handler.getEntries,
    id: {
      GET: handler.getEntryById,
      PUT: handler.putEntryById,
      DELETE: handler.deleteEntryById
    }
  },
  votes: {
    id: {
      POST: handler.incrementVotesById
    }
  }
};

module.exports = router;
