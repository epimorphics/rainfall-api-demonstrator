"use strict";

var gulp = require("gulp");
var sass = require("gulp-sass");
var browserSync = require("browser-sync");
var useref = require("gulp-useref");
var uglify = require("gulp-uglify");
var gulpIf = require("gulp-if");
var del = require("del");
var runSequence = require("run-sequence");
var gulp = require("gulp");
var babel = require("gulp-babel");
var selenium = require("selenium-standalone");
var webdriver = require("gulp-webdriver");
var bower = require("gulp-bower");
var nunjucksRender = require("gulp-nunjucks-render");

var devBrowserSync = browserSync.create();
var testingBrowserSync = browserSync.create();

var seleniumServer;

// Source code translation

function sassTask() {
  return gulp
    .src("app/scss/**/*.scss")
    .pipe(sass())
    .pipe(gulp.dest("app/css"))
    .pipe(browserSync.reload({
      stream: true
    }));
}
gulp.task("sass", sassTask);

function babelTask() {
  gulp
    .src("app/es/**/*.js")
    .pipe(babel({
      presets: ["es2015"]
    }))
    .pipe(gulp.dest("app/js"));
}
gulp.task("babel", babelTask);

function bowerTask() {
  return bower()
    .pipe(gulp.dest("app/vendor/"));
}
gulp.task("bower", bowerTask);

function nunjucksTask() {
  return gulp
    .src("app/pages/**/*.+(html)")
    .pipe(
      nunjucksRender({
        path: ["app/templates"]
      })
    )
  .pipe(gulp.dest("app"));
}
gulp.task("nunjucks", nunjucksTask);

// Development web server

function browserSyncTask( done ) {
  devBrowserSync.init({
    server: {
      baseDir: "app"
    },
    browser: ["google chrome"]
  });
  done();
}
gulp.task("browserSync", browserSyncTask);

function watchTask( done ) {
  gulp.watch("app/scss/**/*.scss", ["sass"]);
  gulp.watch("app/es/**/*.js", ["babel"]);
  gulp.watch("app/templates/**/*", ["nunjucks"]);
  gulp.watch("app/*.html", devBrowserSync.reload);
  gulp.watch("app/js/**/*.js", devBrowserSync.reload);
  done();
}
gulp.task("watch", ["browserSync", "sass", "babel"], watchTask);

// Test web server

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

gulp.task("test:server", ["sass", "babel"], testingBrowserSyncTask );

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
gulp.task("test", ["test:e2e"], function() {
  testingBrowserSync.cleanup();
  seleniumServer.kill();
} );

// Distribution

function userefTask(){
  return gulp
    .src("app/*.html")
    .pipe(useref())
    .pipe(gulpIf("*.js", uglify()))
    .pipe(gulp.dest("dist"));
}
gulp.task("useref", userefTask);

function imagesTask() {
  return gulp
    .src("app/images/**/*+(png|jpg|jpeg|gif|svg)")
    .pipe(gulp.dest("dist/images"));
}
gulp.task("images", imagesTask);

function cleanDistTask() {
  return del.sync("dist");
}
gulp.task("clean:dist", cleanDistTask);

function buildTask(callback) {
  runSequence(
    "clean:dist",
    "bower",
    "nunjucks",
    ["sass","babel"],
    ["useref", "images"],
    callback
  );
}
gulp.task("build", buildTask);

gulp.task("default", buildTask);
