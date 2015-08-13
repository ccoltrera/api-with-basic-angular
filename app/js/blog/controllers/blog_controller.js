"use strict";

module.exports = function(app) {

  app.controller("blogController", ["$scope", "$http", "$location", function(blogScope, $http, $location) {

    blogScope.errors = [];

    function errorHandler(res) {
      blogScope.errors.push({msg: "could not complete your request"});
      console.log(res.data)
    }

    blogScope.user = "";

    blogScope.reader = function() {
      blogScope.user = "reader";
      $location.path("/reader");
    }

    blogScope.writer = function() {
      blogScope.user = "writer";
      $location.path("/writer");
    }

  }]);
};
