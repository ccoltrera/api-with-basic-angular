"use strict";

module.exports = function(app) {
  app.directive("entryWriter", function() {
    return {
      restrict: "AC",
      replace: true,
      templateUrl: "/js/blog/templates/entry_writer_template.html",
      scope: {
        save: "&",
        buttonText: "=",
        entry: "="
      }
    }
  })
};
