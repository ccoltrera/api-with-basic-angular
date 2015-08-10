"use strict";
require("../../app/js/client.js");
require("angular-mocks");

describe("reader controller", function() {
  var $ControllerConstructor;
  var $httpBackend;
  var $scope;

  beforeEach(angular.mock.module("blogApp"));

  beforeEach(angular.mock.inject(function(_$rootScope_, _$controller_) {
    $scope = _$rootScope_.$new();
    $ControllerConstructor = _$controller_;
  }));

  describe("REST functionality", function() {
    beforeEach(angular.mock.inject(function(_$httpBackend_, _$rootScope_) {
      $httpBackend = _$httpBackend_;
      $ControllerConstructor("readerController", {$scope: $scope});
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
    //     $scope.getAll();
    //     $httpBackend.flush();
    //     expect($scope.entries.length).toBe(1);
    //     expect($scope.entries[0].title).toBe("what a title!");
    //     expect($scope.entries[0]._id).toBe(1);
    // });

  });

  describe("Non-REST functionality", function() {

  });

});
