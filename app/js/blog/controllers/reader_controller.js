"use strict";

module.exports = function(app) {

  app.controller("readerController", ["$scope", "$http", function($scope, $http) {

    $scope.errors = [];

    function errorHandler(res) {
      $scope.errors.push({msg: "could not complete your request"});
      console.log(res.data)
    }

    $scope.vote = function(entry) {
      entry.votes ++;
      entry.voted = true;
      $http.post("/api/votes/" + entry._id)
        .then(function(res) {
          // success

        }, function(res) {
          // error
          errorHandler(res);
          // restore old votes
          $scope.$parent.entries[$scope.$parent.entries.indexOf(entry)].votes --;
        });
    };
  }]);
};
