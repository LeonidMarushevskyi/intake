var gulp = require('gulp');
var sass = require('gulp-sass');
var sourcemaps = require('gulp-sourcemaps');

var vinylSource = require('vinyl-source-stream')
var vinylBuffer = require('vinyl-buffer')
function bundle(browserifyPack, name) {
  var p = browserifyPack.bundle().pipe(vinylSource(name)).pipe(vinylBuffer())
  return p.pipe(sourcemaps.init({loadMaps: true}))
  .pipe(sourcemaps.write('.'))
  .pipe(gulp.dest('public/assets/'))
}

var browserify = require('browserify')
var babelify = require('babelify')
var appPack = browserify({
  entries: ['app/assets/javascripts/application.js'],
  paths: ['./app/assets/javascripts/'],
  debug: true,
}).transform(babelify)

gulp.task('default', ['js-app', 'compile-scss']);

gulp.task('compile-scss', function() {
  gulp.src('app/assets/stylesheets/application.scss')
  .pipe(sourcemaps.init())
  .pipe(sass({ indentedSyntax: false, errLogToConsole: true }))
  .pipe(sourcemaps.write())
  .pipe(gulp.dest('public/assets'));
});

gulp.task('js-app', function() {
  return bundle(appPack, 'application.js')
})
