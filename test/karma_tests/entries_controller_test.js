"use strict";
require("../../app/js/client.js");
require("angular-mocks");

describe("entries controller", function() {
  var $ControllerConstructor;
  var $httpBackend;
  var $scope;

  beforeEach(angular.mock.module("entriesApp"));

  beforeEach(angular.mock.inject(function($rootScope, $controller) {
    $scope = $rootScope.$new();
    $ControllerConstructor = $controller;
  }));

  it("should be able to create a controller", function() {
    var entriesController = $ControllerConstructor("entriesController", { $scope: $scope});
    expect(typeof entriesController).toBe("object");
    expect(typeof $scope.getAll).toBe("function");
    expect(Array.isArray($scope.entries)).toBe(true);
  });

});
