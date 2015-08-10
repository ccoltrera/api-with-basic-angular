"use strict";

function errorHandler(res) {
  $scope.errors.push({msg: "could not complete your request"});
  console.log(res.data)
}

module.exports = function(app) {
  app.controller("blogController", ["$scope", "$http", function($scope, $http) {
    $scope.user = "";

    $scope.reader = function() {
      $scope.user = "reader";
    }

    $scope.writer = function() {
      $scope.user = "writer";
    }

    $scope.logout = function() {
      $scope.user = "";
      $scope.getAll();
    }

    $scope.entries = [];

    $scope.getAll = function() {
      $http.get("/api/entries")
        .then(function(res) {
          // success
          $scope.entries = res.data;
        }, function(res) {
          // error
          errorHandler(res);
        });
    };
  }]);
};
