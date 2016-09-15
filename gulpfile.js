"use strict";

var babel = require("babelify");
var babelCompiler = require("babel-register");
var browserSync = require("browser-sync");
var del = require("del");
var gulp = require("gulp");
var gulpMocha = require("gulp-mocha");
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
    .src("app/images/**/*+(png|jpg|jpeg|gif|svg)")
    .pipe(gulp.dest("build/images"));
}
gulp.task("compile:images", imagesTask);

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
      "./app/es/app.js",
      {debug: true}
    ).transform(babel);

  function rebundle() {
    return bundler
      .bundle()
      .on("error", function(err) { console.error(err); this.emit("end"); })
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

gulp.task("compile", ["compile:html", "compile:js", "compile:sass", "compile:images"]);

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
  gulp.watch("app/es/**/*.js", ["compile:js"]);
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
      // compilers:babelCompiler
    }));
}
gulp.task("test:unit", testUnitTask);

// End-to-end testing in web server
///////////////////////////////////

function testingBrowserSyncTask( done ) {
  testingBrowserSync.init({
    server: {
      baseDir: "test/fixtures"
    },
    port: 9000,
    browser: "chromium-browser"
  });
  done();
}
gulp.task("testingBrowserSync", testingBrowserSyncTask);

gulp.task("test:server", ["compile"], testingBrowserSyncTask );

function seleniumStandaloneTask(done) {
  selenium.install( {
    logger: console.log
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

function e2eTask() {
  return gulp
    .src("wdio.conf.js")
    .pipe(webdriver())
    .on("error", function() {
      seleniumServer.kill();
      process.exit(1);
    });
}

gulp.task("test:e2e", ["test:server", "test:selenium"], e2eTask );
gulp.task("test", ["test:unit", "test:e2e"], function() {
  testingBrowserSync.cleanup();
  seleniumServer.kill();
} );

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
