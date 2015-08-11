"use strict";

module.exports = function(app) {
  app.directive("hallo", function() {
    return {
      require: "ngModel",
      link: function($scope, $element, $attrs, ngModelCtrl) {
        $element.hallo({
          plugins: {
            "halloformat": {},
            "halloblock": {},
            "hallojustify": {},
            "hallolists": {},
            "halloreundo": {}
          }
        });
      }
    }
  });
}

