var Entry = require(__dirname + "/model");

//to handle POST of entries
function postEntry(req, res) {
  //Check if entry a duplicate by title
  Entry.find({title: req.body.title}, function(err, entries) {
    if (err) res.sendStatus(500);
    else if (entries.length === 0) {
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
}

function getEntries(req, res) {
  Entry.find({}, function(err, entries) {
    if (err) res.sendStatus(500);
    else {
      res.json(entries);
    }
  });
}

function getEntryByTitle(req, res) {
  //Decode the URI encoded title
  var entryTitle = decodeURIComponent(req.params.title);
  Entry.find({title: entryTitle}, function(err, entries) {
    if (entries.length === 0) {
      res.sendStatus(404);
    } else {
      res.json(entries[0]);
    }
  });
}

function putEntryByTitle(req, res) {
  //Decode the URI encoded title
  var entryTitle = decodeURIComponent(req.params.title);
  Entry.find({title: entryTitle}, function(err, entries) {
    if (err) res.sendStatus(500);
    else if (entries.length === 0) {
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
}

function deleteEntryByTitle(req, res) {
  var entryTitle = decodeURIComponent(req.params.title);
  Entry.find({title: entryTitle}, function(err, entries) {
    if (err) res.sendStatus(500);
    else if (entries.length === 0) {
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
}

function incrementVotesByTitle(req, res) {
  var entryTitle = decodeURIComponent(req.params.title);
  Entry.find({title: entryTitle}, function(err, entries) {
    if (err) res.sendStatus(500);
    else if (entries.length === 0) {
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
}

module.exports = {
  postEntry: postEntry,
  getEntries: getEntries,
  getEntryByTitle: getEntryByTitle,
  putEntryByTitle: putEntryByTitle,
  deleteEntryByTitle: deleteEntryByTitle,
  incrementVotesByTitle: incrementVotesByTitle
};
