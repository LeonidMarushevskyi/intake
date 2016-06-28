var gulp = require('gulp');
var sass = require('gulp-sass');

gulp.task('default', ['compile-scss']);

gulp.task('compile-scss', function() {
  gulp.src('app/assets/stylesheets/**/*.scss')
  .pipe(sass({ indentedSyntax: false, errLogToConsole: true }))
  .pipe(gulp.dest('public/assets'));
});
