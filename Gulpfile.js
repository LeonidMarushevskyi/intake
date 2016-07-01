var env = process.env.RAILS_ENV
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
function bundle(browserifyPack, path, fileName) {
  var p = browserifyPack.bundle().pipe(vinylSource(fileName)).pipe(vinylBuffer())
  return p.pipe(sourcemaps.init({loadMaps: true}))
  .pipe(sourcemaps.write('.'))
  .pipe(gulp.dest(path))
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

var glob = require('glob')
var testPack = browserify({
  entries: glob.sync('spec/javascripts/**/*Spec.js'),
  paths: ['./app/assets/javascripts/'],
  debug: true,
}).external(npmDependencies).transform(babelify)

gulp.task('default', ['js-vendor', 'js-app', 'compile-scss', 'images'])

gulp.task('compile-scss', function() {
  gulp.src('app/assets/stylesheets/application.scss')
  .pipe(sourcemaps.init())
  .pipe(sass({ indentedSyntax: false, errLogToConsole: true }))
  .pipe(sourcemaps.write())
  .pipe(gulp.dest('tmp/assets/'))
})

gulp.task('images', function() {
  return gulp.src('app/assets/images/**/*')
  .pipe(gulp.dest('tmp/assets'))
})

gulp.task('js-app', function() {
  return bundle(appPack, 'tmp/assets/', 'application.js')
})

gulp.task('js-vendor', function() {
  return bundle(vendorPack, 'tmp/assets/', 'vendor.js')
})

gulp.task('js-test', function() {
  return bundle(testPack, 'public/assets/', 'application-test.js')
})

var connect = require('gulp-connect')
gulp.task('server', function() {
  connect.server({
    root: 'public/',
    port: 4857,
    livereload: false,
  })
})

var clean = require('gulp-clean')
gulp.task('clean-build-assets', function () {
  return gulp.src('tmp/assets/*', {read: false})
  .pipe(clean())
})

var runSequence = require('run-sequence')
gulp.task('build-and-version-assets', ['clean-build-assets'], function() {
  if(!env || env == 'development' || env == 'test') {
    runSequence(
      ['js-vendor', 'js-app', 'compile-scss', 'images'],
      ['copy-build-assets']
    )
  } else {
    runSequence(
      ['js-vendor', 'js-app', 'compile-scss', 'images'],
      ['version-assets'],
      ['translate-versioned-assets']
    )
  }
})

var fingerprint = require('gulp-fingerprint')
gulp.task('translate-versioned-assets', function() {
  return gulp.src('public/assets/**/*.css')
  .pipe(fingerprint('public/assets/rev-manifest.json'))
  .pipe(gulp.dest('public/assets/'))
})

gulp.task('copy-build-assets', function () {
  return gulp.src(['tmp/assets/**/*'])
  .pipe(gulp.dest('public/assets/'))
})

var rev = require('gulp-rev')
gulp.task('version-assets', function () {
  return gulp.src([
    'tmp/assets/**/*',
    '!tmp/assets/**/*.map'
  ])
  .pipe(rev())
  .pipe(gulp.dest('public/assets'))
  .pipe(rev.manifest())
  .pipe(gulp.dest('public/assets'))
})
