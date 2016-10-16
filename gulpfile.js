var gulp = require('gulp'),
    browserSync = require('browser-sync'),
    sass = require('gulp-sass'),
    prefix = require('gulp-autoprefixer'),
    gutil = require('gulp-util'),
    plumber = require('gulp-plumber'),
    cp = require('child_process');

// Build the Jekyll Site
gulp.task('jekyll-build', function (done) {
    var jekyll = process.platform === "win32" ? "jekyll.bat" : "jekyll";
    return cp.spawn(jekyll, ['build', '--config', '_config.yml,_config_dev.yml'], {stdio: 'inherit'})
        .on('close', done);
});

// Rebuild Jekyll & do page reload
gulp.task('jekyll-rebuild', ['jekyll-build'], function () {
    browserSync.reload();
});

// browser-sync
gulp.task('browser-sync', ['jekyll-build'], function () {
    browserSync({
        server: {
            baseDir: '_site'
        }
    });
});

// sass
gulp.task('sass', function () {
    return gulp.src([
        '_scss/main.scss'
    ])
    .pipe(plumber(function (error) {
        gutil.log(gutil.colors.red(error.message));
        this.emit('end');
    }))
    .pipe(sass({
        includePaths: ['scss'],
        outputStyle: 'compressed',
        onError: browserSync.notify
    }))
    .pipe(prefix(['last 2 version', '> 0%', 'ie > 7', 'safari 5', 'ios 6', 'android 4'], {cascade: true}))
    .pipe(gulp.dest('_site/assets/css'))
    .pipe(browserSync.reload({stream: true}))
    .pipe(gulp.dest('assets/css'));
});


// gulp watch
gulp.task('watch', ['browser-sync'], function () {
    gulp.watch([
        '_scss/**/*',
        '_components/**/*.scss'
    ], ['sass']);
    gulp.watch([
        '_layouts/**/*',
        '_components/**/*.html',
        '_components/**/*.js',
        '_components/**/*.yml',
        '_components/**/*.json',
        '_pages/**/*',
        'assets/img/**/*',
        'assets/fonts/**/*',
        '_config.yml',
        '_config_dev.yml'
    ], ['jekyll-rebuild']);
});

// gulp
gulp.task('default', ['sass']);
