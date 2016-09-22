"use strict";
/* global process */

var babel = require("babelify");
require("babel-register");
var browserSync = require("browser-sync");
var del = require("del");
var gulp = require("gulp");
var gulpMocha = require("gulp-mocha");
var gutil = require("gulp-util");
var nunjucksRender = require("gulp-nunjucks-render");
var runSequence = require("run-sequence");
var sass = require("gulp-sass");
var selenium = require("selenium-standalone");
var webdriver = require("gulp-webdriver");

var sourcemaps = require("gulp-sourcemaps");
var source = require("vinyl-source-stream");
var buffer = require("vinyl-buffer");
var browserify = require("browserify");

// Instances

var devBrowserSync = browserSync.create();
var testingBrowserSync = browserSync.create();
var seleniumServer;

// Source code generation
/////////////////////////

function imagesTask() {
  return gulp
    .src([
      "app/images/**/*+(png|jpg|jpeg|gif|svg)",
      "node_modules/leaflet/dist/images/**/*"
    ])
    .pipe(gulp.dest("build/images"));
}
gulp.task("compile:images", imagesTask);

function fontsTask() {
  return gulp
    .src("node_modules/font-awesome/fonts/**/*")
    .pipe(gulp.dest("build/fonts"));
}
gulp.task("compile:fonts", fontsTask);

function sassTask() {
  return gulp
    .src("app/scss/**/*.scss")
    .pipe(sass())
    .pipe(gulp.dest("build/css"));
}
gulp.task("compile:sass", sassTask);

function compileJsTask() {
  var bundler =
    browserify(
      "./app/es/app.es",
      {debug: true}
    ).transform(babel);

  function rebundle() {
    return bundler
      .bundle()
      .on("error", function(err) { gutil.log(err); this.emit("end"); })
      .pipe(source("build.js"))
      .pipe(buffer())
      .pipe(sourcemaps.init({ loadMaps: true }))
      .pipe(sourcemaps.write("./"))
      .pipe(gulp.dest("./build/js"));
  }

  return rebundle();
}
gulp.task("compile:js", compileJsTask);

function nunjucksTask() {
  return gulp
    .src("app/pages/**/*.+(html)")
    .pipe(
      nunjucksRender({
        path: ["app/templates"]
      })
    )
  .pipe(gulp.dest("build"));
}
gulp.task("compile:html", nunjucksTask);

gulp.task("compile", ["compile:html", "compile:js", "compile:sass", "compile:images", "compile:fonts"]);

// Development web server
/////////////////////////

function browserSyncTask( done ) {
  devBrowserSync.init({
    server: {
      baseDir: "build"
    },
    browser: ["chromium-browser"]
  });
  done();
}
gulp.task("browserSync", browserSyncTask);

function watchTask( done ) {
  gulp.watch("app/scss/**/*.scss", ["compile:sass"]);
  gulp.watch("app/es/**/*.es", ["compile:js"]);
  gulp.watch("app/templates/**/*", ["compile:html"]);
  gulp.watch("app/pages/**/*", ["compile:html"]);
  gulp.watch("app/images/**/*", ["compile:images"]);
  gulp.watch("build/**/*", devBrowserSync.reload);
  done();
}
gulp.task("watch", ["browserSync", "compile"], watchTask);

// Unit testing
///////////////

function testUnitTask() {
  return gulp
    .src(["test/unit/**/*.+(js|es)"])
    .pipe(gulpMocha({
    }));
}
gulp.task("test:unit", testUnitTask);

// End-to-end testing in web server
///////////////////////////////////

function nunjucksFixturesTask() {
  return gulp
    .src("test/fixtures/pages/**/*.+(html)")
    .pipe(
      nunjucksRender({
        path: ["app/templates"]
      })
    )
  .pipe(gulp.dest("build"));
}
gulp.task("compile:fixtures", nunjucksFixturesTask);

function testingBrowserSyncTask( done ) {
  testingBrowserSync.init({
    server: {
      baseDir: "build"
    },
    port: 9000,
    browser: "chromium-browser"
  });
  done();
}
gulp.task("testingBrowserSync", testingBrowserSyncTask);

gulp.task("test:server",
          ["compile:js", "compile:sass", "compile:images", "compile:fixtures", "compile:fonts"],
          testingBrowserSyncTask );

function seleniumStandaloneTask(done) {
  selenium.install( {
    logger: gutil.log
  }, function() {
    selenium.start( function( err, child ) {
      if (err) {
        return done(err);
      }
      else {
        seleniumServer = child;
        return done();
      }
    } );
  });
}
gulp.task( "test:selenium", seleniumStandaloneTask );

function functionalTestTask() {
  return gulp
    .src("wdio.conf.js")
    .pipe(webdriver())
    .on("error", function() {
      seleniumServer.kill();
      process.exit(1);
    });
}

gulp.task("test:functional", ["test:server", "test:selenium"], functionalTestTask );
gulp.task("test:functional-and-cleanup", ["test:functional"], function() {
  testingBrowserSync.cleanup();
  seleniumServer.kill();
} );

gulp.task("test", ["test:unit", "test:functional-and-cleanup"] );

// Distribution
///////////////

function cleanBuildTask() {
  return del.sync("build");
}
gulp.task("build:clean", cleanBuildTask);

function buildTask(callback) {
  runSequence(
    "build:clean",
    "compile",
    callback
  );
}
gulp.task("build", buildTask);

gulp.task("default", buildTask);
