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

function getEntryById(req, res) {
  var entry_id = req.params.id;
  Entry.find({_id: entry_id}, function(err, entries) {
    if (err) res.sendStatus(500);
    else if (entries.length === 0) {
      res.sendStatus(404);
    } else {
      res.json(entries[0]);
    }
  });
}

function putEntryById(req, res) {
  var entry_id = req.params.id;
  Entry.find({_id: entry_id}, function(err, entries) {
    if (err) res.sendStatus(500);
    else if (entries.length === 0) {
      var reqEntry = new Entry(req.body);
      reqEntry.save(function(err, reqEntry) {
        if (err) {
          res.sendStatus(500);
        } else {
          res.sendStatus(201);
        }
      });
    } else {
      Entry.findOneAndUpdate({_id: entry_id}, {entryBody: req.body.entryBody, title: req.body.title}, {overwrite: true}, function(err) {
          console.log(err)
        if (err) {
          res.sendStatus(500);
        } else {
          res.sendStatus(200);
        }
      });
    }
  });
}

function deleteEntryById(req, res) {
  var entry_id = req.params.id;
  Entry.find({_id: entry_id}, function(err, entries) {
    if (err) res.sendStatus(500);
    else if (entries.length === 0) {
      res.sendStatus(400);
    } else {
      Entry.remove({_id: entry_id}, function(err) {
        if (err) {
          res.sendStatus(500);
        } else {
          res.sendStatus(200);
        }
      });
    }
  });
}

function incrementVotesById(req, res) {
  var entry_id = req.params.id;
  Entry.find({_id: entry_id}, function(err, entries) {
    if (err) res.sendStatus(500);
    else if (entries.length === 0) {
      res.sendStatus(400);
    } else {
      Entry.update({_id: entry_id}, {$inc: {votes: 1}}, function(err) {
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
  getEntryById: getEntryById,
  putEntryById: putEntryById,
  deleteEntryById: deleteEntryById,
  incrementVotesById: incrementVotesById
};
