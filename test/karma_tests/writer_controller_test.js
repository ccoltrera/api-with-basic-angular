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

    blogScope.entries = [{
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

    writerScope = blogScope.$new();
    $ControllerConstructor = _$controller_;
    $ControllerConstructor("blogController", {$scope: blogScope});
    $ControllerConstructor("writerController", {$scope: writerScope});
  }));

  describe("REST functionality", function() {
    beforeEach(angular.mock.inject(function(_$httpBackend_, _$rootScope_) {
      $httpBackend = _$httpBackend_;
    }));

    afterEach(function() {
      $httpBackend.verifyNoOutstandingExpectation();
      $httpBackend.verifyNoOutstandingRequest();
    });

    // it("should make a get request when getAll is called", function() {
    //     $httpBackend.expectGET("/api/entries").respond(200, [{
    //       datePosted: new Date,
    //       title: "what a title!",
    //       entryBody: "what an entry!",
    //       votes: 0,
    //       _id: 1
    //     }]);
    //     blogScope.getAll();
    //     $httpBackend.flush();
    //     expect(blogScope.entries.length).toBe(1);
    //     expect(blogScope.entries[0].title).toBe("what a title!");
    //     expect(blogScope.entries[0]._id).toBe(1);
    // });

    // it("should make a get request and set var user to '' when logout is called", function() {
    //     blogScope.user = "reader";
    //     $httpBackend.expectGET("/api/entries").respond(200, [{
    //       datePosted: new Date,
    //       title: "what a title!",
    //       entryBody: "what an entry!",
    //       votes: 0,
    //       _id: 1
    //     }]);
    //     blogScope.logout();
    //     $httpBackend.flush();
    //     expect(blogScope.entries.length).toBe(1);
    //     expect(blogScope.entries[0].title).toBe("what a title!");
    //     expect(blogScope.entries[0]._id).toBe(1);
    //     expect(blogScope.user).toBe("");
    // });

  });

  describe("Non-REST functionality", function() {

    // it("should set var user to 'reader' when reader is called", function() {
    //   blogScope.reader();
    //   expect(blogScope.user).toBe("reader");
    // })

    // it("should set var user to 'writer' when writer is called", function() {
    //   blogScope.writer();
    //   expect(blogScope.user).toBe("writer");
    // })

  });

});
