"use strict";

require("angular/angular");

var entryApp = angular.module("entriesApp", []);

require("./entries/entries")(entryApp);
