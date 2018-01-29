var gulp = require('gulp'),
    watch = require('gulp-watch'),
    autoprefixer = require('gulp-autoprefixer'),
    uglify = require('gulp-uglify'),
    cssmin = require('gulp-cssmin'),
    jsmin = require('gulp-jsmin'),
    rigger = require('gulp-rigger'),
    rename = require('gulp-rename'),
    util = require('gulp-util'),
    sass = require('gulp-sass'),
    sourcemaps = require('gulp-sourcemaps'),
    fileInclude = require('gulp-file-include');

var historyApiFallback = require('connect-history-api-fallback');
var browserSync = require('browser-sync').create();
var reload = browserSync.reload;

var path = {
    build: { //Тут мы укажем куда складывать готовые после сборки файлы
        js: 'dist/js/',
        html: 'dist/',
        css: 'dist/css/',
        img: 'dist/img/',
        fonts: 'dist/fonts/'
    },
    src: {
        js: 'src/js/*.js',
        style: 'src/style/main.scss',
        html: 'src/*.html',
        img: 'src/img/**/*.*',
        fonts: 'src/fonts/**/*.*'
    },

    watch: { //Тут мы укажем, за изменением каких файлов мы хотим наблюдать
        html: 'src/**/*.html',
        js: 'src/js/**/*.js',
        style: 'src/style/**/*.scss',
        img: 'src/img/**/*.*',
        fonts: 'src/fonts/**/*.*'
    },
    clean: './dist'
};
gulp.task('html', function () {
    return gulp.src(path.src.html)
        .pipe(fileInclude({
            prefix: '@@',
            basepath: 'src/html_includes/'
        }))
        .pipe(gulp.dest(path.build.html))
        .pipe(reload({ stream:true }));
});
gulp.task('fonts', function () {
    gulp.src(path.src.fonts)
        .pipe(gulp.dest(path.build.fonts))
        .pipe(reload({ stream:true }));
});
gulp.task('images', function() {
    gulp.src(path.src.img) // возьмем наши картинки
        .pipe(gulp.dest(path.build.img)) //И бросим в build
        /*.pipe(imagemin({ //Сожмем их
            progressive: true,
            svgoPlugins: [{removeViewBox: false}],
            use: [pngquant()],
            interlaced: true
        }))*/
        .pipe(reload({ stream:true }));
});
gulp.task('styles', function () {
    return gulp.src(path.src.style)
        .pipe(sourcemaps.init())
        .pipe(sass().on('error', sass.logError))
        .pipe(sourcemaps.write())
        .pipe(rename('style.css'))
        .pipe(gulp.dest(path.build.css))
        .pipe(reload({ stream:true }));
});
gulp.task('styles-min', function () {
    return gulp.src(path.src.style)
        .pipe(sass().on('error', sass.logError))
        .pipe(autoprefixer({
            browsers: ['> 0.01%'],
            cascade: false
        }))
        .pipe(cssmin())
        .pipe(rename('style.css'))
        .pipe(gulp.dest(path.build.css))
        .pipe(reload({ stream:true }));
});
gulp.task('js', function () {
    return gulp.src(path.src.js)
        .pipe(rigger())
        .pipe(gulp.dest(path.build.js))
        .pipe(reload({ stream:true }));
});
gulp.task('js-min', function () {
    return gulp.src(path.src.js)
        .pipe(rigger())
        .pipe(uglify()).on('error', util.log)
        .pipe(jsmin())
        .pipe(gulp.dest(path.build.js))
        .pipe(reload({ stream:true }));
});

gulp.task('dev-watch', ['dev'], function () {
    browserSync.init({
        server: {
            baseDir: "./dist",
            middleware: [historyApiFallback({})]
        },
        port: 3000
    });
    watch([path.watch.html], function(event, cb) {
        gulp.start('html');
    });
    watch([path.watch.style], function(event, cb) {
        gulp.start('styles');
    });
    watch([path.watch.js], function(event, cb) {
        gulp.start('js');
    });
    watch([path.watch.img], function(event, cb) {
        gulp.start('images');
    });
});

gulp.task('prod-watch', ['prod'], function () {
    browserSync.init({
        server: {
            baseDir: "./dist",
            middleware: [historyApiFallback({})]
        },
        port: 3000
    });
    watch([path.watch.html], function(event, cb) {
        gulp.start('html');
    });
    watch([path.watch.style], function(event, cb) {
        gulp.start('styles-min');
    });
    watch([path.watch.js], function(event, cb) {
        gulp.start('js-min');
    });
    watch([path.watch.img], function(event, cb) {
        gulp.start('images');
    });
});
gulp.task('dev', ['html', 'styles', 'js']);
gulp.task('prod', ['html', 'styles-min', 'js-min']);


gulp.task('default', ['dev-watch']);