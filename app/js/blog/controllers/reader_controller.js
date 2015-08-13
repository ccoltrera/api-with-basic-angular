"use strict";

module.exports = function(app) {

  app.controller("readerController", ["$scope", "$http", "$location", function(readerScope, $http, $location) {

    function errorHandler(res) {
      readerScope.$parent.errors.push({msg: "could not complete your request"});
      console.log(res.data)
    }

    readerScope.logout = function() {
      $location.path("/welcome");
      readerScope.$destroy();
    }

    readerScope.getAll = function() {
      $http.get("/api/entries")
        .then(function(res) {
          // success
          readerScope.entries = res.data;
        }, function(res) {
          // error
          errorHandler(res);
        });
    };

    readerScope.vote = function(entry) {
      entry.votes ++;
      entry.voted = true;
      $http.post("/api/votes/" + entry._id)
        .then(function(res) {
          // success

        }, function(res) {
          // error
          errorHandler(res);
          // restore old votes
          readerScope.$parent.entries[readerScope.$parent.entries.indexOf(entry)].votes --;
        });
    };
  }]);
};
