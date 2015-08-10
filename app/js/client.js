"use strict";

require("angular/angular");

var entryApp = angular.module("blogApp", []);

require("./blog/blog")(entryApp);
