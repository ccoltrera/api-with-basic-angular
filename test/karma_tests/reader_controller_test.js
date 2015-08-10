"use strict";
require("../../app/js/client.js");
require("angular-mocks");

describe("blog controller", function() {
  var $ControllerConstructor;
  var $httpBackend;
  var blogScope;
  var readerScope;

  beforeEach(angular.mock.module("blogApp"));

  beforeEach(angular.mock.inject(function(_$rootScope_, _$controller_) {
    blogScope = _$rootScope_.$new();
    readerScope = blogScope.$new();
    $ControllerConstructor = _$controller_;
    $ControllerConstructor("blogController", {$scope: blogScope});

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

    $ControllerConstructor("readerController", {$scope: readerScope});
  }));

  describe("REST functionality", function() {
    beforeEach(angular.mock.inject(function(_$httpBackend_, _$rootScope_) {
      $httpBackend = _$httpBackend_;
    }));

    afterEach(function() {
      $httpBackend.verifyNoOutstandingExpectation();
      $httpBackend.verifyNoOutstandingRequest();
    });

    it("should make a post request when vote is called, and increment the votes on the entry", function() {
        $httpBackend.expectPOST("/api/votes/2").respond(200);
        readerScope.vote(blogScope.entries[1]);
        $httpBackend.flush();
        expect(blogScope.entries[0].votes).toBe(0);
        expect(blogScope.entries[1].votes).toBe(2);
    });

    it("should make a post request when vote is called, but decrement the votes again if there's an error", function() {
        $httpBackend.expectPOST("/api/votes/2").respond(500);
        readerScope.vote(blogScope.entries[1]);
        $httpBackend.flush();
        expect(blogScope.entries[0].votes).toBe(0);
        expect(blogScope.entries[1].votes).toBe(1);
    });
  });
});
