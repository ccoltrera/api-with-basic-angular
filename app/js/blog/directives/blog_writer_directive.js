"use strict";

module.exports = function(app) {
  app.directive("blogWriter", function() {
    return {
      restrict: "AC",
      replace: true,
      templateUrl: "/js/blog/templates/blog_writer_template"
    }
  })
};
