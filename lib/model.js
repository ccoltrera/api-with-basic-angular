"use strict";

var mongoose = require("mongoose");

var entrySchema = mongoose.Schema({
  datePosted: {type: Date, default: Date.now},
  dateEdited: Date,
  title: {type: String, unique: true},
  entryBody: String,
  votes: {type: Number, default: 0}
});

//Mongoose middleware to
entrySchema.post("save", function(doc) {
  console.log("'" + doc.title + "' has been saved.");
});

var Entry = mongoose.model("Entry", entrySchema);

module.exports = Entry;
