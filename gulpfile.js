var gulp = require('gulp')
var concat = require('gulp-concat')
var watch = require('gulp-watch')
var watch = require('gulp-copy')

gulp.task('js', function () {
  gulp.src(['app/**/module.js', 'app/**/*.js'])
    .pipe(concat('app.js'))
    .pipe(gulp.dest('public/js'))
})

gulp.task('html', function () {
    gulp.src('./app/**/*.html')
      .pipe(gulp.dest('./public/templates'));
})

gulp.watch('app/**/*.js', ['js']);
gulp.watch('app/**/*.html', ['html']);
gulp.task('default', ['js', 'html']);