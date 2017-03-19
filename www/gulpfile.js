var gulp = require('gulp'),
  	wiredep = require('wiredep').stream,
  	useref = require('gulp-useref'),
    gulpif = require('gulp-if'),
    uglify = require('gulp-uglify'),
    autoprefixer = require('gulp-autoprefixer'),
    sass = require('gulp-sass'),
    csso = require('gulp-csso'),
    concatCss = require('gulp-concat-css'),
    shorthand = require('gulp-shorthand'),
    cleanCSS = require('gulp-clean-css'),
    rename = require("gulp-rename"),
    imagemin = require('gulp-imagemin'),
    minify = require('gulp-minify'),
    jsmin = require('gulp-jsmin'),
    notify = require("gulp-notify");

// Build dist
gulp.task('html', function () {
   return gulp.src('app/*.html')
    .pipe(useref())
    .pipe(gulp.dest('dist'))
    .pipe(notify("html Done!"));
});

// sass
gulp.task('sass', function() {
  return gulp.src('app/scss/styles.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(csso())
    .pipe(rename('styles.css'))
    .pipe(gulp.dest('app/css'))
    .pipe(notify("sass Done!"));
});

// minify and autoprefixer css
gulp.task('minifyCSS', function() {
  return gulp.src('app/css/*.css')
    .pipe(shorthand())
    .pipe(autoprefixer({
        browsers: ['last 60 versions'],
        cascade: false
    }))
    //.pipe(cleanCSS({compatibility: 'ie8'}))
    .pipe(gulp.dest('app/css'))
    .pipe(notify("minify and autoprefixer css Done!"));
});

// minify js
gulp.task('compressJS', function() {
  gulp.src('app/js/*.js')
    .pipe(minify({
        ext:{
            src:'-debug.js',
            min:'.js'
        },
        exclude: ['tasks'],
        ignoreFiles: ['.combo.js', '-min.js']
    }))
    .pipe(jsmin())
    .pipe(rename('main.js'))
    .pipe(gulp.dest('dist/scripts'))
    .pipe(notify("compressJS Done!"));
});

//image minify
gulp.task('imageminify', function () {
  gulp.src('app/images/*')
    .pipe(imagemin())
    .pipe(gulp.dest('dist/images'))
    .pipe(notify("imageminify Done!"));
});

gulp.task('bower', function () {
  gulp.src('app/index.html')
    .pipe(wiredep({
      optional: 'configuration',
      goes: 'app/bower_components'
    }))
    .pipe(gulp.dest('./app'));
});

gulp.task('watch', function () {
	gulp.watch('bower.json', ['bower'])
  gulp.watch('app/scss/styles.scss', ['sass'])
  gulp.watch('app/css/*.css', ['minifyCSS'])
  gulp.watch('app/js/main.js', ['compressJS'])
  gulp.watch('app/index.html', ['html'])
});