var gulp = require('gulp');
var sass = require('gulp-sass');
var sourcemaps = require('gulp-sourcemaps');

gulp.task('default', ['compile-scss']);

gulp.task('compile-scss', function() {
  gulp.src('app/assets/stylesheets/application.scss')
  .pipe(sourcemaps.init())
  .pipe(sass({ indentedSyntax: false, errLogToConsole: true }))
  .pipe(sourcemaps.write())
  .pipe(gulp.dest('public/assets'));
});
