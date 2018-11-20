var gulp = require('gulp');
var sass = require('gulp-sass');
var cleanCss = require('gulp-clean-css');
var rename = require('gulp-rename');
var autoprefixer = require('gulp-autoprefixer');
var runSequence = require('run-sequence');
var base64 = require('gulp-base64');
//var minify = require('gulp-minify');
var connect = require('gulp-connect');
var open = require('gulp-open');
var livereload = require('gulp-livereload');
var browserSync = require('browser-sync').create();

// ... variables
// var autoprefixerOptions = {
//   browsers: ['last 2 versions', '> 5%', 'Firefox ESR']
// };
var paths = {
    sass: ['./css/**/*.scss'],
    js: ['./js/*.js'],
    html: ['./views/*.html']
};
gulp.task("serve:before", ['watch']);

gulp.task('default', ['sass', 'autoprefix', 'processes', 'watch'], function () {

});
gulp.task('connect', function () {
    connect.server({
        root: './',
        port: 8001,
        livereload: true
    });
});
gulp.task('open', function () {
    gulp.src('./index.html')
        .pipe(open({
            uri: 'http://localhost:8001/'
        }));
});

gulp.task('sass', function (done) {
    console.log('sass called');
    gulp.src('css/main.scss')
        .pipe(sass())
        .on('error', sass.logError)
        .pipe(gulp.dest('css/'))
        .pipe(cleanCss({
            keepSpecialComments: 0
        }))


        .pipe(gulp.dest('css/'))
        .on('end', done);
});

gulp.task('base64', function () {
    return gulp.src('./css/main.css')
        .pipe(base64())
        //  .pipe(concat('main.css'))
        .pipe(gulp.dest('./css/'));
});

gulp.task('autoprefix', function () {
    gulp.src('./css/main.css')
        .pipe(autoprefixer({
            browsers: ['last 2 versions'],
            cascade: false
        }))
        .pipe(gulp.dest('./css/'))
});


gulp.task('processes', function () {
    console.log('css canged');
    runSequence('sass', 'autoprefix', 'base64',browserSync.reload);
    
});

gulp.task('start', function () {
   browserSync.init({
    server: {
        baseDir: "./",
        
    }
  });
});
gulp.watch(paths.sass, ['processes']);
gulp.watch(paths.js,browserSync.reload);
gulp.watch(paths.html, browserSync.reload);
