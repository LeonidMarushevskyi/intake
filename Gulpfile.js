var gulp = require('gulp');
var sass = require('gulp-sass');
var sourcemaps = require('gulp-sourcemaps');

function getNPMPackageIds() {
  var packageManifest = {};
  try {
    packageManifest = require('./package.json');
  } catch (e) {}
  var deps = Object.keys(packageManifest.dependencies) || []
  return deps
}
var npmDependencies = getNPMPackageIds()

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
}).external(npmDependencies).transform(babelify)

var vendorPack = browserify({
  debug: false,
  require: npmDependencies,
})

gulp.task('default', ['js-vendor', 'js-app', 'compile-scss']);

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

gulp.task('js-vendor', function() {
  return bundle(vendorPack, 'vendor.js')
})

var connect = require('gulp-connect')
gulp.task('server', function() {
  connect.server({
    root: 'public/',
    port: 4857,
    livereload: false,
  })
})

