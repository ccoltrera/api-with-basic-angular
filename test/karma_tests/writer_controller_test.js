"use strict";
require("../../app/js/client.js");
require("angular-mocks");

describe("blog controller", function() {
  var $ControllerConstructor;
  var $httpBackend;
  var blogScope;
  var writerScope;

  beforeEach(angular.mock.module("blogApp"));

  beforeEach(angular.mock.inject(function(_$rootScope_, _$controller_) {
    blogScope = _$rootScope_.$new();
    writerScope = blogScope.$new();
    $ControllerConstructor = _$controller_;
    $ControllerConstructor("blogController", {$scope: blogScope});
    $ControllerConstructor("writerController", {$scope: writerScope});

    writerScope.entries = [{
          datePosted: new Date,
          title: "what a title!",
          entryBody: "what an entry!",
          votes: 0,
          _id: 1
        },
        {
          datePosted: new Date,
          title: "another title!",
          entryBody: "another entry!",
          votes: 1,
          _id: 2
        }];
  }));

  describe("REST functionality", function() {
    beforeEach(angular.mock.inject(function(_$httpBackend_, _$rootScope_) {
      $httpBackend = _$httpBackend_;
    }));

    afterEach(function() {
      $httpBackend.verifyNoOutstandingExpectation();
      $httpBackend.verifyNoOutstandingRequest();
    });

    it("should make a get request when getAll is called", function() {
        $httpBackend.expectGET("/api/entries").respond(200, [{
          datePosted: new Date,
          title: "what a title!",
          entryBody: "what an entry!",
          votes: 0,
          _id: 1
        }]);
        writerScope.getAll();
        $httpBackend.flush();
        expect(writerScope.entries.length).toBe(1);
        expect(writerScope.entries[0].title).toBe("what a title!");
        expect(writerScope.entries[0]._id).toBe(1);
    });

    it("should make a post request when create is called", function() {
      $httpBackend.expectPOST("/api/entries").respond(200, {
        datePosted: new Date,
        title: "another great title!",
        entryBody: "another great entry!",
        votes: 0,
        _id: 3
      });
      writerScope.create({title: "send great title!", entryBody: "another great entry!"});
      $httpBackend.flush();

      expect(writerScope.entries.length).toBe(3);
      expect(writerScope.entries[0].title).toBe("another great title!");
      expect(writerScope.entries[0]._id).toBe(3);
    });

    it("should make a delete request when destroy is called", function() {
      $httpBackend.expectDELETE("/api/entries/2").respond(200);
      writerScope.destroy({
          title: "another title!",
          entryBody: "another entry!",
          votes: 1,
          _id: 2
        });

      $httpBackend.flush();

      expect(writerScope.entries.length).toBe(1);
    });

    it("should make a put request when update is called, and update entry", function() {
      var editedEntry = {
          dateEdited: new Date,
          title: "edited title!",
          entryBody: "edited entry!",
          votes: 1,
          _id: 2
        }
      $httpBackend.expectPUT("/api/entries/2").respond(200, editedEntry);

      writerScope.entries[1].oldBody = writerScope.entries[1].entryBody;
      writerScope.entries[1].entryBody = "such an edited body";

      writerScope.update(writerScope.entries[1]);
      $httpBackend.flush();

      expect(writerScope.entries[1].title).toBe(editedEntry.title);
    });

    it("should make a put request when update is called, but restore to the old entry on error", function() {
      $httpBackend.expectPUT("/api/entries/2").respond(500);

      writerScope.entries[1].oldBody = writerScope.entries[1].entryBody;
      writerScope.entries[1].entryBody = "such an edited body";
      writerScope.entries[1].oldTitle = writerScope.entries[1].title;
      writerScope.entries[1].title = "such an edited title";

      writerScope.update(writerScope.entries[1]);

      $httpBackend.flush();

      expect(writerScope.entries[1].title).toBe("another title!");
      expect(writerScope.entries[1].entryBody).toBe("another entry!");
    });
  });

  describe("Non-REST functionality", function() {

    it("should set editing to true on an entry, and save its old body and title when edit is called", function() {
      writerScope.edit(writerScope.entries[0]);
      expect(writerScope.entries[0].editing).toBe(true);
      expect(writerScope.entries[0].oldBody).toBe(writerScope.entries[0].entryBody);
      expect(writerScope.entries[0].oldTitle).toBe(writerScope.entries[0].title);
    });

    it("should set editing to false on an entry, and restore its old body and title when cancelEdit is called", function() {
      writerScope.entries[0].editing = true;
      writerScope.entries[0].oldBody = writerScope.entries[0].entryBody;
      writerScope.entries[0].entryBody = "";
      writerScope.entries[0].oldTitle = writerScope.entries[0].title;
      writerScope.entries[0].title = "";

      writerScope.cancelEdit(writerScope.entries[0]);
      expect(writerScope.entries[0].editing).toBe(false);
      expect(writerScope.entries[0].entryBody).toBe(writerScope.entries[0].oldBody);
      expect(writerScope.entries[0].title).toBe(writerScope.entries[0].oldTitle);
    });

    it("should destroy the scope when logout is called", function() {
      writerScope.logout();
      expect(writerScope.$parent).toBe(null);
    });
  });
});
