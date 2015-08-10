"use strict";

module.exports = function(app) {
  app.controller("writerController", ["$scope", "$http", function($scope, $http) {

    $scope.errors = [];
    $scope.newEntry = {};

    function errorHandler(res) {
      $scope.errors.push({msg: "could not complete your request"});
      console.log(res.data)
    }

    $scope.create = function(entry) {
      $scope.newEntry = {};
      $http.post("/api/entries", entry)
        .then(function(res) {
          // success
          $scope.$parent.entries.unshift(res.data);
        }, function(res) {
          // error
          errorHandler(res);
          // // remove entry that failed to save
          // $scope.$parent.entries.splice($scope.$parent.entries.indexOf(entry), 1);
        });
    };

    $scope.destroy = function(entry) {
      // Save entry index, so that on server-side error post can be restored
      var indexOfEntry = $scope.$parent.entries.indexOf(entry);

      $http.delete("/api/entries/" + entry._id)
        .then(function(res) {
          // success
          $scope.$parent.entries.splice($scope.$parent.entries.indexOf(entry), 1);
        }, function(res) {
          // error
          errorHandler(res);
          // // restore entry that failed to delete
          // $scope.$parent.entries.splice(indexOfEntry, 0, entry);
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
          $scope.$parent.entries[$scope.$parent.entries.indexOf(entry)] = res.data;
        }, function(res) {
          // error
          errorHandler(res);
          // restore old entryBody
          entry.entryBody = entry.oldBody;
          // restore old title
          entry.title = entry.oldTitle;
        });
    };
  }]);
};
