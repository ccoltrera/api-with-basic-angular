"use strict";
require("../../app/js/client.js");
require("angular-mocks");

describe("blog controller", function() {
  var $ControllerConstructor;
  var $httpBackend;
  var $scope;

  beforeEach(angular.mock.module("blogApp"));

  beforeEach(angular.mock.inject(function(_$rootScope_, _$controller_) {
    $scope = _$rootScope_.$new();
    $ControllerConstructor = _$controller_;
  }));

  it("should be able to create a controller", function() {
    var entriesController = $ControllerConstructor("blogController", { $scope: $scope});
    expect(typeof entriesController).toBe("object");
    expect(typeof $scope.getAll).toBe("function");
    expect(Array.isArray($scope.entries)).toBe(true);
  });

  describe("REST functionality", function() {
    beforeEach(angular.mock.inject(function(_$httpBackend_, _$rootScope_) {
      $httpBackend = _$httpBackend_;
      $scope = _$rootScope_.$new();
      $ControllerConstructor("blogController", {$scope: $scope});
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
      $scope.getAll();
      $httpBackend.flush();
      expect($scope.entries.length).toBe(1);
      expect($scope.entries[0].title).toBe("what a title!");
      expect($scope.entries[0]._id).toBe(1);
  });

  });

});
