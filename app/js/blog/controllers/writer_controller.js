"use strict";

function errorHandler(res) {
  $scope.errors.push({msg: "could not complete your request"});
  console.log(res.data)
}

module.exports = function(app) {
  app.controller("writerController", ["$scope", "$http", function($scope, $http) {
    $scope.newEntry = {};

    $scope.create = function(entry) {
      $scope.newEntry = {};
      $http.post("/api/entries", entry)
        .then(function(res) {
          // success
          $scope.entries.unshift(res.data);
        }, function(res) {
          // error
          errorHandler(res);
        });
    };

    $scope.destroy = function(entry) {
      $http.delete("/api/entries/" + entry._id)
        .then(function(res) {
          // success
          $scope.entries.splice($scope.entries.indexOf(entry), 1);
        }, function(res) {
          // error
          errorHandler(res);
        });
    };

    $scope.edit = function(entry) {
      entry.editing = true;
      entry.oldBody = entry.entryBody;
      entry.oldTitle = entry.title;
    }

    $scope.cancelEdit = function(entry) {
      entry.editing = false;
      entry.entryBody = entry.oldBody;
      entry.title = entry.oldTitle;
    }

    $scope.update = function(entry) {
      entry.editing = false;
      entry.dateEdited = new Date();
      $http.put("/api/entries/" + entry._id, entry)
        .then(function(res) {
          // success
          $scope.entries[$scope.entries.indexOf(entry)] = res.data;
        }, function(res) {
          // error
          errorHandler(res);
          // restore old entryBody
          $scope.entries[$scope.entries.indexOf(entry)].entryBody = $scope.entries[$scope.entries.indexOf(entry)].oldBody;
        });
    };
  }]);
};
