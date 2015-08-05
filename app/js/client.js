"use strict";

require("angular/angular");

var entryApp = angular.module("entryApp", []);

require("./entries/entries")(entryApp);
