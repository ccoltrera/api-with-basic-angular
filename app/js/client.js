"use strict";

require("angular/angular");
require("angular-route");
require("./blog/services/services");
require("./blog/directives/directives");

var blogApp = angular.module("blogApp", ["services", "directives", "ngRoute"]);

require("./blog/blog")(blogApp);

blogApp.config(["$routeProvider", function($routeProvider) {
  $routeProvider
    .when("/reader", {
      templateUrl: "/js/blog/views/reader_view.html",
      controller: "readerController"
    })
    .when("/writer", {
      templateUrl: "/js/blog/views/writer_view.html",
      controller: "writerController"
    })
    .when("/welcome", {
      templateUrl: "/js/blog/views/welcome_view.html"
    })
    .otherwise({
      redirectTo: "/welcome"
    });
}]);
