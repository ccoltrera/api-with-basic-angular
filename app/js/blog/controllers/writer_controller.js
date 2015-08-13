"use strict";

module.exports = function(app) {
  app.controller("writerController", ["$scope", "$http", "$location", function(writerScope, $http, $location) {

    writerScope.entries = [];
    writerScope.newEntry = {};

    function errorHandler(res) {
      writerScope.$parent.errors.push({msg: "could not complete your request"});
      console.log(res.data)
    }

    writerScope.logout = function() {
      $location.path("/welcome");
      writerScope.$destroy();
    }

    writerScope.getAll = function() {
      $http.get("/api/entries")
        .then(function(res) {
          // success
          writerScope.entries = res.data;
        }, function(res) {
          // error
          errorHandler(res);
        });
    };

    writerScope.create = function(entry) {
      writerScope.newEntry = {};
      $http.post("/api/entries", entry)
        .then(function(res) {
          // success
          writerScope.entries.unshift(res.data);
        }, function(res) {
          // error
          errorHandler(res);
          // // remove entry that failed to save
          // writerScope.entries.splice(writerScope.entries.indexOf(entry), 1);
        });
    };

    writerScope.destroy = function(entry) {
      // Save entry index, so that on server-side error post can be restored
      var indexOfEntry = writerScope.entries.indexOf(entry);

      $http.delete("/api/entries/" + entry._id)
        .then(function(res) {
          // success
          writerScope.entries.splice(writerScope.entries.indexOf(entry), 1);
        }, function(res) {
          // error
          errorHandler(res);
          // // restore entry that failed to delete
          // writerScope.entries.splice(indexOfEntry, 0, entry);
        });
    };

    writerScope.edit = function(entry) {
      entry.editing = true;
      entry.oldBody = entry.entryBody;
      entry.oldTitle = entry.title;
    }

    writerScope.cancelEdit = function(entry) {
      entry.editing = false;
      entry.entryBody = entry.oldBody;
      entry.title = entry.oldTitle;
    }

    writerScope.update = function(entry) {
      entry.editing = false;
      entry.dateEdited = new Date();
      $http.put("/api/entries/" + entry._id, entry)
        .then(function(res) {
          // success
          writerScope.entries[writerScope.entries.indexOf(entry)] = res.data;
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
