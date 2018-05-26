var gulp = require('gulp')
var sass = require('gulp-sass')
var sourcemaps = require('gulp-sourcemaps')

gulp.task('sass', function () {
  return gulp.src('./public/stylesheets/style.scss')
    .pipe(sourcemaps.init())
    .pipe(sass({
      outputStyle: 'compressed'
    }).on('error', sass.logError))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('./public/stylesheets'))
})

gulp.task('sass:watch', function () {
  gulp.watch('./public/stylesheets/**/*.scss', ['sass'])
})
