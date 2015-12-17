// plugins

var gulp          = require('gulp');

var browserSync   = require('browser-sync').create();
var reload        = browserSync.reload;

var sass          = require('gulp-sass');

var postcss       = require('gulp-postcss');
var autoprefixer  = require('autoprefixer');
var mqpacker      = require('css-mqpacker');

var fileinclude   = require('gulp-file-include');

var wiredep       = require('wiredep').stream;

var useref        = require('gulp-useref');

var gulpif        = require('gulp-if');
var uglify        = require('gulp-uglify');
var minifyCss     = require('gulp-minify-css');


// config

var config = {
  server: {
    notify: false,
    server: {
      baseDir: './' ,
      directory: true
    },
    startPath: './dev/html-preview/'
  },
  devPath: {},
  buildPath: {}
}


// build

gulp.task('css:build', function(){

  var processors = [
    autoprefixer({browsers: ['last 2 versions'], cascade: false}),
    mqpacker()
  ];

  gulp.src('./dev/static/scss/**/*.scss')
    .pipe(sass({outputStyle: 'compact'}).on('error', sass.logError))
    .pipe(postcss(processors))
    .pipe(gulp.dest('./build/static/css/'));

})

gulp.task('html:build', function () {
    return gulp.src('./dev/html-preview/*.html')
        .pipe(useref())
        .pipe(gulpif('*.js', uglify()))
        .pipe(gulpif('*.css', minifyCss()))
        .pipe(gulp.dest('./build/html/'));
});

gulp.task('move:build', function () {
    gulp.src('./dev/tmp/**/*')
        .pipe(gulp.dest('./build/tmp'))
});

gulp.task('build', [
    'html:build',
    'css:build',
    'move:build'
]);


// dev

gulp.task('html:dev', function () {

  gulp.src('./dev/html/partial/*.html')
    .pipe(wiredep())
    .pipe(gulp.dest('./dev/html/partial'))

  gulp.src('./dev/html/*.html')    
    .pipe(fileinclude({
      prefix: '@@',
      basepath: '@file'
    }))    
    .pipe(gulp.dest('./dev/html-preview'))
    .pipe(reload({stream: true}));

});

gulp.task('sass:dev', function(){

  return gulp.src('./dev/static/scss/*.scss')
    .pipe(sass({outputStyle: 'compact'}).on('error', sass.logError))
    .pipe(gulp.dest('./dev/static/css/'))
    .pipe(browserSync.stream());

});


gulp.task('serve', ['html:dev', 'sass:dev'], function(){
  
  browserSync.init(config.server);

  gulp.watch('./dev/html/*.html', ['html:dev']);

  gulp.watch('./dev/static/scss/**/*.scss', ['sass:dev']);  

})