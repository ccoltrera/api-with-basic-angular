"use strict";
var apiServer = require(__dirname + "/../api");
var Entry = require(__dirname + "/../lib/model");

var mongoose = require("mongoose");

var chai = require("chai");
var chaiHttp = require("chai-http");
var expect = chai.expect;

chai.use(chaiHttp);

describe("Blog API", function() {
  var oldEntryObject = {
    date: new Date(),
    title: "Old Entry",
    content: "I am old. So old. So very old.",
    votes: 7
  };
  var newEntryObject = {
    date: new Date(),
    title: "New Entry",
    content: "I am new, so very new!"
  };
  var editedEntryObject = {
    date: new Date(),
    title: "Edited Entry",
    content: "Nicely edited!"
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
    oldEntry.save(function(err, oldEntry) {
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
    apiServer.close();
    done();
  });

  describe("/api/entry", function() {
    describe("POST", function() {
      it("should, with unique title, respond with 201 (created) and add Entry to the DB", function(done) {
        chai.request("http://localhost:8080")
          .post("/api/entry")
          .send(newEntryObject)
          .end(function(err, res) {
            expect(err).to.eql(null);
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
          .post("/api/entry")
          .send(oldEntryObject)
          .end(function(err, res) {
            expect(err).to.eql(null);
            expect(res).to.have.status(409);
            done();
          });
      });
    });
  });

  describe("/api/entry/:title", function() {
    describe("GET", function() {
      it("should, with matching Entry by URI encoded title, respond with 200, and that Entry as JSON", function(done) {
        chai.request("http://localhost:8080")
          .get("/api/entry/Old%20Entry")
          .end(function(err, res) {
            expect(err).to.eql(null);
            expect(res).to.have.status(200);
            expect(res).to.be.json;
            expect(res.body.title).to.eql(oldEntryObject.title);
            done();
          });
      });
      it("should, without matching Entry by URI encoded title, respond with 404", function(done) {
        chai.request("http://localhost:8080")
          .get("/api/entry/Fake%20Entry")
          .end(function(err, res) {
            expect(err).to.eql(null);
            expect(res).to.have.status(404);
            done();
          });
      });
    });

    describe("PUT", function() {
      it("should, with matching Entry by URI encoded title, respond with 200 and overwrite that Entry", function(done) {
        chai.request("http://localhost:8080")
          .put("/api/entry/Old%20Entry")
          .send(editedEntryObject)
          .end(function(err, res) {
            expect(err).to.eql(null);
            expect(res).to.have.status(200);
            Entry.find(editedEntryObject, function(err, entries) {
              //Votes should reset to the default, because it's a complete overwrite
              expect(entries[0].votes).to.eql(0);
              done();
            });
          });
      });
      it("should, without matching Entry by URI encoded title, respond with 201 (created) and add Entry to the DB", function(done) {
        chai.request("http://localhost:8080")
          .put("/api/entry/New%20Entry")
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
      it("should, with matching Entry by URI encoded title, respond with 200 and delete that Entry", function(done) {
        chai.request("http://localhost:8080")
          .delete("/api/entry/Old%20Entry")
          .end(function(err, res) {
            expect(err).to.eql(null);
            expect(res).to.have.status(200);
            Entry.find(oldEntryObject, function(err, entries) {
              expect(entries.length).to.eql(0);
              done();
            });
          });

      });
      it("should, without matching Entry by URI encoded title, respond with 400 (bad request)", function(done) {
        chai.request("http://localhost:8080")
          .delete("/api/entry/Fake%20Entry")
          .end(function(err, res) {
            expect(err).to.eql(null);
            expect(res).to.have.status(400);
            done();
          });
      });
    });
  });

  describe("/api/vote/:title", function() {
    describe("PATCH", function() {
      it("should, with matching Entry by URI encoded title, respond with 200 and increment the votes", function(done) {
        chai.request("http://localhost:8080")
          .patch("/api/vote/Old%20Entry")
          .end(function(err, res) {
            expect(err).to.eql(null);
            expect(res).to.have.status(200);
            Entry.find({title: oldEntryObject.title}, function(err, entries) {
              expect(entries[0].votes).to.eql(8);
              done();
            });
          });
      });
      it("should, without matching Entry by URI encoded title, respond with 400 (bad request)", function(done) {
        chai.request("http://localhost:8080")
          .patch("/api/vote/Fake%20Entry")
          .end(function(err, res) {
            expect(err).to.eql(null);
            expect(res).to.have.status(400);
            done();
          });
      });
    });
  });
});
