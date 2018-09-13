// INCLUDE GULP

var gulp = require('gulp');


// INCLUDE GULP PLUGINS

const autoprefixer = require('gulp-autoprefixer');
const browserSync = require('browser-sync').create();
const cache = require('gulp-cache');
const cleanCSS = require('gulp-clean-css');
const gutil = require('gulp-util');
const concat = require('gulp-concat');
const imagemin = require('gulp-imagemin');
const jshint = require('gulp-jshint');
const plumber = require('gulp-plumber');
const pug = require('gulp-pug');
const runSequence = require('run-sequence');
const sass = require('gulp-sass');
const sourcemaps = require('gulp-sourcemaps');
const uglify = require('gulp-uglify');
const watch = require('gulp-watch');


// PATHS

const source_root = './src/';
const build_root = './docs/';

// ERROR HANDLING

var gulp_src = gulp.src;
gulp.src = function () {
    return gulp_src.apply(gulp, arguments)
        .pipe(plumber(function (error) {
                gutil.log(gutil.colors.red('Error (' + error.plugin + '): ' + error.message));
                this.emit('end');
            })
        );
};


// BROWSER SYNC

gulp.task('browser-sync', function () {
    browserSync.init({
        browser: "chrome",
        notify: false,
        open: false,
        reloadDelay: 1000,
        server: {
            baseDir: build_root,
        }
    });
});


// FONTS

gulp.task('fonts', function () {
    gulp.src([
        'node_modules/font-awesome/fonts/**/*',
        source_root + 'assets/fonts/**/*'
    ])
        .pipe(gulp.dest(build_root + 'assets/fonts/'))
        .pipe(browserSync.stream());
});


// IMAGES

gulp.task('images', function () {
    gulp.src(source_root + 'assets/img/**/*.+(png|jpg|jpeg|gif|svg)')
        .pipe(cache(imagemin({
            interlaced: true
        })))
        .pipe(gulp.dest(build_root + 'assets/img/'))
        .pipe(browserSync.stream());
});


// JS

gulp.task('js', function () {
    gulp.src([
        './node_modules/jquery/dist/jquery.js',
        './node_modules/bootstrap/dist/js/bootstrap.js',
        source_root + 'assets/js/**/*.+(js|jsx)'
    ])
        .pipe(sourcemaps.init())
        .pipe(jshint())
        .pipe(jshint.reporter('jshint-stylish'))
        .pipe(concat('main.js'))
        .pipe(uglify())
        .pipe(sourcemaps.write('maps'))
        .pipe(gulp.dest(build_root + 'assets/js/'));
});


// SASS

gulp.task('sass', function () {
    gulp.src(source_root + 'assets/sass/**/*.sass')
        .pipe(sourcemaps.init())
        .pipe(sass().on('error', sass.logError))
        .pipe(autoprefixer({
            browsers: [
                'last 2 versions'
            ],
            cascade: false,
            remove: false
        }))
        .pipe(cleanCSS({
            level: {
                1: {
                    specialComments: 'none'
                }
            }
        }))
        .pipe(sourcemaps.write('maps'))
        .pipe(gulp.dest(build_root + 'assets/css/'))
        .pipe(browserSync.stream());
});


// PUG

gulp.task('pug', function () {
    gulp.src(source_root + '**/!(_)*.pug')
        .pipe(pug({pretty: true}))
        .pipe(gulp.dest(build_root));
});


// CLEAR CACHE

gulp.task('clearcache', function (callback) {
    return cache.clearAll(callback);
});


// WATCH

gulp.task('watch', ['browser-sync'], function () {

    gulp.watch('**/*.html').on('change', browserSync.reload);

    watch(source_root + 'assets/img/**/*.+(png|jpg|jpeg|gif|svg)', function () {
        gulp.start('images');
    });

    watch(source_root + 'assets/js/**/*.+(js|jsx)', function () {
        gulp.start('js');
    });

    watch(source_root + 'assets/sass/**/*.sass', function () {
        gulp.start('sass');
    });

    watch(source_root + '**/*.pug', function () {
        gulp.start('pug');
    });

});


// DEFAULT

gulp.task('default', function (callback) {
    runSequence(['clearcache', 'images', 'fonts', 'sass', 'js', 'pug'], callback);
});
