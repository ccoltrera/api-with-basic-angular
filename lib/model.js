"use strict";

var mongoose = require("mongoose");

var entrySchema = mongoose.Schema({
  date: {type: Date, default: Date.now},
  title: String,
  content: String,
  votes: {type: Number, default: 0}
});

var Entry = mongoose.model("Entry", entrySchema);

module.exports = Entry;
