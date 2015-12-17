// plugins

var gulp          = require('gulp');

var browserSync   = require('browser-sync').create();
var reload        = browserSync.reload({stream: true});

var sass          = require('gulp-sass');

var postcss       = require('gulp-postcss');
var autoprefixer  = require('autoprefixer');
var mqpacker      = require('css-mqpacker');

var wiredep       = require('wiredep').stream;

var useref        = require('gulp-useref');

var gulpif        = require('gulp-if');
var uglify        = require('gulp-uglify');
var minifyCss     = require('gulp-minify-css');


// config

var config = {
  server: {},
  devPath: {},
  buildPath: {}
}


// build

gulp.task('css:build', function(){

  var processors = [
    autoprefixer({browsers: ['last 2 versions'], cascade: false}),
    mqpacker()
  ];

  gulp.src('./static/scss/**/*.scss')
    .pipe(sass({outputStyle: 'compact'}).on('error', sass.logError))
    .pipe(postcss(processors))
    .pipe(gulp.dest('./static/css/'));

})

gulp.task('html:build', function () {
    return gulp.src('./html/*.html')
        .pipe(useref())
        .pipe(gulpif('*.js', uglify()))
        .pipe(gulpif('*.css', minifyCss()))
        .pipe(gulp.dest('./build/html/'));
});

gulp.task('build', [
    'html:build',
    'css:build'
]);


// dev

gulp.task('sass', function(){

  gulp.src('./static/scss/**/*.scss')
    .pipe(sass({outputStyle: 'compact'}).on('error', sass.logError))
    .pipe(gulp.dest('./static/css/'))
    .pipe(browserSync.stream());

});

gulp.task('html', function () {
  gulp.src('./html/*.html')
    .pipe(wiredep())
    .pipe(fileinclude({
      prefix: '@@',
      basepath: '@file'
    }))
    .pipe(gulp.dest('./html-preview/'))
    .pipe(reload({stream: true}));
});


gulp.task('serve', ['html', 'sass'], function(){
  
  browserSync.init({
    notify: false,
    server: {
      baseDir: './' ,
      directory: true
    },
    startPath: './html-preview/'
  });

  gulp.watch('./html/*.html').on('change', function(){
    gulp.run('html');
  });

  gulp.watch('./static/scss/**/*.scss' , ['sass']);

})