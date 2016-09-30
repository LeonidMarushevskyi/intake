var env = process.env.RAILS_ENV
var gulp = require('gulp')
var sass = require('gulp-sass')
var sourcemaps = require('gulp-sourcemaps')
var isProduction = (env && !(env === 'development' || env === 'test'))

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
var gulpif = require('gulp-if')
var uglify = require('gulp-uglify')
function bundle(browserifyPack, path, fileName) {
  return browserifyPack.bundle().pipe(vinylSource(fileName)).pipe(vinylBuffer())
  .pipe(gulpif(isProduction, uglify({preserveComments: 'some'})))
  .pipe(gulp.dest(path))
}

var browserify = require('browserify')
var babelify = require('babelify')
var appPack = browserify({
  entries: ['app/assets/javascripts/application.js'],
  paths: ['./app/assets/javascripts/'],
  extensions: ['.jsx'],
  debug: true,
}).external(npmDependencies).transform(babelify)

var vendorPack = browserify({
  debug: false,
  require: npmDependencies,
})

var glob = require('glob')
var testPack = browserify({
  entries: glob.sync('spec/javascripts/**/*Spec.js?(x)'),
  paths: ['./app/assets/javascripts/'],
  extensions: ['.jsx'],
  debug: true,
}).external(npmDependencies)
  .exclude('react/addons')
  .exclude('react/lib/ReactContext')
  .exclude('react/lib/ExecutionEnvironment')
  .transform(babelify)

gulp.task('default', ['build-and-version-assets'])

gulp.task('compile-scss', function() {
  gulp.src('app/assets/stylesheets/application.scss')
  .pipe(sourcemaps.init())
  .pipe(sass({
    indentedSyntax: false,
    errLogToConsole: true,
    includePaths: [
      'node_modules/',
      'app/assets/stylesheets/'
    ],
    outputStyle: 'expanded'
  }))
  .pipe(sourcemaps.write())
  .pipe(gulp.dest('tmp/assets/'))
})

gulp.task('images', function() {
  return gulp.src('app/assets/images/**/*')
  .pipe(gulp.dest('tmp/assets'))
})

gulp.task('fonts', function() {
  return gulp.src('app/assets/fonts/**/*')
  .pipe(gulp.dest('tmp/assets/fonts'))
})

gulp.task('js-app', function() {
  return bundle(appPack, 'tmp/assets/', 'application.js')
})

gulp.task('js-vendor', function() {
  return bundle(vendorPack, 'tmp/assets/', 'vendor.js')
})

gulp.task('js-test', function() {
  return bundle(testPack, 'tmp/assets/', 'application-test.js')
})

var connect = require('gulp-connect')
var cors = require('cors')
gulp.task('server', function() {
  connect.server({
    root: 'public/',
    port: 4857,
    livereload: false,
    middleware: function() {
      return [cors()];
    }
  })
})

var clean = require('gulp-clean')
gulp.task('clean-build-assets', function () {
  return gulp.src('tmp/assets/*', {read: false})
  .pipe(clean())
})

var runSequence = require('run-sequence')
gulp.task('build-and-version-assets', ['clean-build-assets'], function() {
  if(isProduction) {
    runSequence(
      ['js-vendor', 'js-app', 'compile-scss', 'images', 'fonts'],
      ['version-assets'],
      ['translate-versioned-assets']
    )
  } else {
    runSequence(
      ['js-vendor', 'js-app', 'compile-scss', 'images', 'fonts'],
      ['copy-build-assets']
    )
  }
})

gulp.task('build-test-assets', ['clean-build-assets'], function() {
  return runSequence(
    ['js-vendor', 'js-test'],
    ['copy-build-assets']
  )
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

gulp.task('watch', ['default', 'server'], function() {
  gulp.watch(['app/assets/javascripts/**/*'], ['default'])
})
