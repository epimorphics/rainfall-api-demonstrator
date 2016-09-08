var gulp = require('gulp');
var sass = require('gulp-sass');
var browserSync = require('browser-sync').create();
var useref = require('gulp-useref');
var uglify = require('gulp-uglify');
var gulpIf = require('gulp-if');
var del = require('del');
var runSequence = require('run-sequence');
var gulp = require('gulp');
var babel = require('gulp-babel');

function sassTask() {
  return gulp
    .src('app/scss/**/*.scss')
    .pipe(sass())
    .pipe(gulp.dest('app/css'))
    .pipe(browserSync.reload({
      stream: true
    }));
}
gulp.task('sass', sassTask);

function babelTask() {
  gulp
    .src('app/es/**/*.js')
    .pipe(babel({
      presets: ['es2015']
    }))
    .pipe(gulp.dest('app/js'));
}

gulp.task('babel', babelTask);

function browserSyncTask( done ) {
  browserSync.init({
    server: {
      baseDir: 'app'
    },
  });
  done();
}
gulp.task('browserSync', browserSyncTask);

function watchTask( done ) {
  gulp.watch('app/scss/**/*.scss', ['sass']);
  gulp.watch('app/es/**/*.js', ['babel']);
  gulp.watch('app/*.html', browserSync.reload);
  gulp.watch('app/js/**/*.js', browserSync.reload);
  done();
}
gulp.task('watch', ['browserSync', 'sass'], watchTask);

// Distribution

function userefTask(){
  return gulp
    .src('app/*.html')
    .pipe(useref())
    .pipe(gulpIf('*.js', uglify()))
    .pipe(gulp.dest('dist'));
}
gulp.task('useref', userefTask);

function imagesTask() {
  return gulp
    .src('app/images/**/*+(png|jpg|jpeg|gif|svg)')
    .pipe(gulp.dest('dist/images'));
}
gulp.task('images', imagesTask);

function cleanDistTask() {
  return del.sync('dist');
}
gulp.task('clean:dist', cleanDistTask);

function buildTask(callback) {
  runSequence(
    'clean:dist',
    ['sass','babel'],
    ['useref', 'images'],
    callback
  );
}
gulp.task('build', buildTask);

gulp.task('default', buildTask);
