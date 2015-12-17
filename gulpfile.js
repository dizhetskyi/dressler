var gulp          = require('gulp');
var sass          = require('gulp-sass');
var browserSync   = require('browser-sync').create();
var reload        = browserSync.reload({stream: true});

gulp.task('sass', function(){

  gulp.src('./static/scss/**/*.scss')
    .pipe(sass({outputStyle: 'compact'}).on('error', sass.logError))
    .pipe(gulp.dest('./static/css/'))
    .pipe(browserSync.stream());

});

gulp.task('serve', ['sass'], function(){
  
  browserSync.init({
    notify: false,
    server: {
      baseDir: './' ,
      directory: true
    },
  });

  gulp.watch('./html/*.html').on('change', function(){
    browserSync.reload();
  });

  gulp.watch('./static/scss/**/*.scss' , ['sass']);

})