var gulp = require('gulp');
var sass = require('gulp-sass');
var cleanCss = require('gulp-clean-css');
var rename = require('gulp-rename');
var autoprefixer = require('gulp-autoprefixer');
var runSequence = require('run-sequence');
var base64 = require('gulp-base64');
var minify = require('gulp-minify');


// ... variables
// var autoprefixerOptions = {
//   browsers: ['last 2 versions', '> 5%', 'Firefox ESR']
// };
var paths = {
  sass: ['./www/scss/**/*.scss']
};

gulp.task("serve:before", ['watch']);

gulp.task('default', ['sass', 'autoprefix', 'processes', 'watch'], function () {

});

gulp.task('sass', function (done) {
  console.log('sass called');
  gulp.src('./www/scss/ionic.app.scss')
    .pipe(sass())
    .on('error', sass.logError)
    .pipe(gulp.dest('./www/css/'))
    .pipe(cleanCss({
      keepSpecialComments: 0
    }))

    .pipe(rename({
      extname: '.min.css'
    }))
    .pipe(gulp.dest('./www/css/'))
    .on('end', done);
});

gulp.task('base64', function () {
  return gulp.src('./www/css/ionic.app.min.css')
    .pipe(base64())
  //  .pipe(concat('main.css'))
    .pipe(gulp.dest('./www/css/'));
});

gulp.task('autoprefix', function () {
  gulp.src('./www/css/ionic.app.min.css')
    .pipe(autoprefixer({
      browsers: ['last 2 versions'],
      cascade: false
    }))
    .pipe(gulp.dest('./www/css/'))
});


gulp.task('processes', function () {
  runSequence('sass', 'autoprefix', 'base64');
});


gulp.watch(paths.sass, ['processes']);
