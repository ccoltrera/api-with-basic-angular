"use strict";

var gulp = require("gulp");
var mocha = require("gulp-mocha");
var jshint = require("gulp-jshint");
var jscs = require("gulp-jscs");
var webpack = require("gulp-webpack");

gulp.task("test", function() {
  return gulp.src("./test/*test.js")
              .pipe(mocha({"reporter" : "progress"}));
});

gulp.task("lint", function() {
  return gulp.src(["./*.js", "./lib/*.js", "./test/*.js"])
              .pipe(jshint())
              .pipe(jshint.reporter("default"));
});

gulp.task("jscs", function() {
  return gulp.src(["./*.js", "./lib/*.js", "./test/*.js"])
              .pipe(jscs());
});

// Uses webpack to bundle all our stuff together?
gulp.task("webpack", function() {
  return gulp.src("app/js/client.js")
    .pipe(webpack({
      output: {
        filename: "bundle.js"
      }
    }))
    .pipe(gulp.dest("public/"));
});

// Copies all our HTML files over to the static served folder
gulp.task("copy", function() {
  return gulp.src("app/**/*.html")
    .pipe(gulp.dest("public/"));
});

gulp.task("build", ["webpack", "copy"]);

gulp.task("watch", function(){
  gulp.watch(["app/**/**"], ["webpack", "copy"]);
});
