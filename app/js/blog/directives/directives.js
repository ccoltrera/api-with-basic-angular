"use strict";

var directives = angular.module("directives", []);
require("./writer_directive")(directives);
require("./reader_directive")(directives);
