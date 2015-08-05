"use strict";
var server = require(__dirname + "/../server");
var Entry = require(__dirname + "/../lib/model");

var mongoose = require("mongoose");

var chai = require("chai");
var chaiHttp = require("chai-http");
var expect = chai.expect;

chai.use(chaiHttp);

describe("Blog API", function() {
  var oldEntryObject = {
    date: new Date(),
    _id: new mongoose.Types.ObjectId(),
    title: "Old Entry",
    entryBody: "I am old. So old. So very old.",
    votes: 7
  };
  var newEntryObject = {
    date: new Date(),
    _id: new mongoose.Types.ObjectId(),
    title: "New Entry",
    entryBody: "I am new, so very new!"
  };
  var editedEntryObject = {
    date: new Date(),
    title: "Edited Entry",
    entryBody: "Nicely edited!"
  };

  //Ensure tests wait until the connection to the DB is open.
  before(function(done) {
    mongoose.connection.on("open", function() {
      done();
    });
  });
  //And add an Entry to the DB
  beforeEach(function(done) {
    var oldEntry = new Entry(oldEntryObject);
    oldEntry.save(function(err, oldEntryDoc) {
      if (err) {
        console.error(err);
      } else {
        done();
      }
    });
  });
  //Clear the DB after tests.
  afterEach(function(done) {
    mongoose.connection.db.dropDatabase(function() {
      done();
    });
  });
  //After all tests are over, close the database connection and the server.
  after(function(done) {
    mongoose.connection.close();
    server.close();
    done();
  });

  describe("/api/entries", function() {
    describe("POST", function() {
      it("should, with unique title, respond with 201 (created) and add Entry to the DB", function(done) {
        chai.request("http://localhost:8080")
          .post("/api/entries")
          .send(newEntryObject)
          .end(function(err, res) {
            expect(err).to.eql(null);
            expect(res).to.be.json;
            expect(res.body.title).to.eql(newEntryObject.title);
            expect(res).to.have.status(200);
            //Check to ensure that the Entry was added
            Entry.find(newEntryObject, function(err, entries) {
              expect(entries).to.not.eql([]);
              done();
            });
          });
      });
      it("should, with duplicate title, respond with 409 (conflict)", function(done) {
        chai.request("http://localhost:8080")
          .post("/api/entries")
          .send(oldEntryObject)
          .end(function(err, res) {
            expect(err).to.eql(null);
            expect(res).to.have.status(409);
            done();
          });
      });
    });
    describe("GET", function() {
      //And add an Entry to the DB
      beforeEach(function(done) {
        var newEntry = new Entry(newEntryObject);
        newEntry.save(function(err, newEntryDoc) {
          if (err) {
            console.error(err);
          } else {
            done();
          }
        });
      });
      it("should get all entries", function(done) {
        chai.request("http://localhost:8080")
          .get("/api/entries")
          .end(function(err, res) {
            expect(err).to.eql(null);
            expect(res).to.have.status(200);
            expect(res).to.be.json;
            expect(res.body.length).to.eql(2);
            done();
          });
      });
    });
  });

  describe("/api/entries/:id", function() {
    describe("GET", function() {
      it("should, with matching Entry by _id, respond with 200, and that Entry as JSON", function(done) {
        chai.request("http://localhost:8080")
          .get("/api/entries/" + oldEntryObject._id)
          .end(function(err, res) {
            expect(err).to.eql(null);
            expect(res).to.have.status(200);
            expect(res).to.be.json;
            expect(res.body.title).to.eql(oldEntryObject.title);
            done();
          });
      });
      it("should, without matching Entry by _id, respond with 404", function(done) {
        chai.request("http://localhost:8080")
          .get("/api/entries/" + new mongoose.Types.ObjectId())
          .end(function(err, res) {
            expect(err).to.eql(null);
            expect(res).to.have.status(404);
            done();
          });
      });
    });

    describe("PUT", function() {
      it("should, with matching Entry by _id, respond with 200 and overwrite that Entry", function(done) {
        chai.request("http://localhost:8080")
          .put("/api/entries/" + oldEntryObject._id)
          .send(editedEntryObject)
          .end(function(err, res) {
            expect(err).to.eql(null);
            expect(res).to.have.status(200);
            Entry.find({_id: oldEntryObject._id}, function(err, entries) {
              expect(entries[0].title).to.eql(editedEntryObject.title);
              expect(entries[0].body).to.eql(editedEntryObject.body);
              done();
            });
          });
      });
      it("should, without matching Entry by _id, respond with 201 (created) and add Entry to the DB", function(done) {
        chai.request("http://localhost:8080")
          .put("/api/entries/" + newEntryObject._id)
          .send(newEntryObject)
          .end(function(err, res) {
            expect(err).to.eql(null);
            expect(res).to.have.status(201);
            Entry.find(newEntryObject,  function(err, entries) {
              expect(entries.length).to.eql(1);
              done();
            });
          });
      });
    });

    describe("DELETE", function() {
      it("should, with matching Entry by _id, respond with 200 and delete that Entry", function(done) {
        chai.request("http://localhost:8080")
          .delete("/api/entries/" + oldEntryObject._id)
          .end(function(err, res) {
            expect(err).to.eql(null);
            expect(res).to.have.status(200);
            Entry.find(oldEntryObject, function(err, entries) {
              expect(entries.length).to.eql(0);
              done();
            });
          });

      });
      it("should, without matching Entry by _id, respond with 400 (bad request)", function(done) {
        chai.request("http://localhost:8080")
          .delete("/api/entries/" + new mongoose.Types.ObjectId())
          .end(function(err, res) {
            expect(err).to.eql(null);
            expect(res).to.have.status(400);
            done();
          });
      });
    });
  });

  describe("/api/votes/:id", function() {
    describe("POST", function() {
      it("should, with matching Entry by _id, respond with 200 and increment the votes", function(done) {
        chai.request("http://localhost:8080")
          .post("/api/votes/" + oldEntryObject._id)
          .end(function(err, res) {
            expect(err).to.eql(null);
            expect(res).to.have.status(200);
            Entry.find({_id: oldEntryObject._id}, function(err, entries) {
              expect(entries[0].votes).to.eql(8);
              done();
            });
          });
      });
      it("should, without matching Entry by _id, respond with 400 (bad request)", function(done) {
        chai.request("http://localhost:8080")
          .post("/api/votes/" + new mongoose.Types.ObjectId())
          .end(function(err, res) {
            expect(err).to.eql(null);
            expect(res).to.have.status(400);
            done();
          });
      });
    });
  });
});
