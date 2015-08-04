"use strict";

require("angular/angular");

var blogApp = angular.module("blogApp", []);

var blogController = blogApp.controller("blogController", ["$scope", function($scope) {
  $scope.blogPost = "type your blog post here!";
}]);
