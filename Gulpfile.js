var env = process.env.RAILS_ENV
var gulp = require('gulp')
var sass = require('gulp-sass')
var sourcemaps = require('gulp-sourcemaps')
var isProduction = (env && !(env === 'development' || env === 'test'))

gulp.task('default', ['build-and-version-assets'])

gulp.task('react-widgets-styles', function() {
  return gulp.src([
    'node_modules/react-widgets/dist/**/*.css',
    'node_modules/react-widgets/dist/**/*.woff',
    'node_modules/react-widgets/dist/**/*.eot',
    'node_modules/react-widgets/dist/**/*.svg',
    'node_modules/react-widgets/dist/**/*.ttf',
  ])
  .pipe(gulp.dest('tmp/assets/rw'))
})

gulp.task('compile-scss', function() {
  return gulp.src('app/assets/stylesheets/application.scss')
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

var clean = require('gulp-clean')
gulp.task('clean-build-assets', function () {
  return gulp.src('tmp/assets/*', {read: false})
  .pipe(clean())
})

var runSequence = require('run-sequence')
gulp.task('build-and-version-assets', ['clean-build-assets'], function() {
  if(isProduction) {
    runSequence(
      ['compile-scss', 'react-widgets-styles', 'images', 'fonts'],
      ['version-assets'],
      ['translate-versioned-assets']
    )
  } else {
    runSequence(
      ['compile-scss', 'react-widgets-styles', 'images', 'fonts'],
      ['copy-build-assets']
    )
  }
})

gulp.task('build-test-assets', ['clean-build-assets'], function() {
  return runSequence(['copy-build-assets'])
})

var revReplace = require('gulp-rev-replace')
gulp.task('translate-versioned-assets', function() {
  var manifest = gulp.src('public/assets/rev-manifest.json')
  return gulp.src(['public/assets/**/*.css'])
    .pipe(revReplace({manifest: manifest}))
    .pipe(gulp.dest('public/assets/'))
})

gulp.task('copy-build-assets', function () {
  return gulp.src(['tmp/assets/**/*'])
  .pipe(gulp.dest('public/assets/'))
})

var rev = require('gulp-rev')
gulp.task('version-assets', function () {
  return gulp.src([
    'tmp/assets/**/*'
  ])
  .pipe(rev())
  .pipe(gulp.dest('public/assets'))
  .pipe(gulp.dest('public/assets'))
})
