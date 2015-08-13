"use strict";
require("../../app/js/client.js");
require("angular-mocks");

describe("blog controller", function() {
  var $ControllerConstructor;
  var $httpBackend;
  var blogScope;

  beforeEach(angular.mock.module("blogApp"));

  beforeEach(angular.mock.inject(function(_$rootScope_, _$controller_) {
    blogScope = _$rootScope_.$new();
    $ControllerConstructor = _$controller_;
    $ControllerConstructor("blogController", {$scope: blogScope});
  }));

  describe("REST functionality", function() {
    beforeEach(angular.mock.inject(function(_$httpBackend_, _$rootScope_) {
      $httpBackend = _$httpBackend_;
    }));

    afterEach(function() {
      $httpBackend.verifyNoOutstandingExpectation();
      $httpBackend.verifyNoOutstandingRequest();
    });

  });

  describe("Non-REST functionality", function() {
    beforeEach(angular.mock.inject(function(_$rootScope_) {
      $ControllerConstructor("blogController", {$scope: blogScope});
    }));

    it("should set var user to 'reader' when reader is called", function() {
      blogScope.reader();
      expect(blogScope.user).toBe("reader");
    });

    it("should set var user to 'writer' when writer is called", function() {
      blogScope.writer();
      expect(blogScope.user).toBe("writer");
    });
  });
});
