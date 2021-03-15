const { series, src, dest, watch } = require('gulp');
const concat = require('gulp-concat');
const browserSync = require('browser-sync').create();
const clean = require('gulp-clean');

function cleanDist() {
    return src('docs', { read: false }).pipe(clean());
}

function copyHtml() {
    return src('src/index.html').pipe(dest('./docs'));
}

function copyVendorsJs() {
    return src([
        './node_modules/jquery/dist/jquery.min.js',
    ])
        .pipe(concat('vendors.js'))
        .pipe(dest('./docs'));
}

function copyVendorsCss() {
    return src([
        './node_modules/bootstrap/dist/css/bootstrap.min.css',
    ])
        .pipe(concat('vendors.css'))
        .pipe(dest('./docs'));
}

function copyCss() {
    return src('src/**/*.css')
        .pipe(concat('styles.css'))
        .pipe(dest('./docs'));
}

function copyJs() {
    return src('src/**/*.js')
        .pipe(concat('scripts.js'))
        .pipe(dest('./docs'));
}

function startServer(cb) {
    browserSync.init({
        server: {
            baseDir: './docs',
        },
    });

    watch('src/**/*.js', series(copyJs, reloadBrowser));
    watch('src/**/*.css', series(copyCss, reloadBrowser));

    cb();
}

function reloadBrowser(cb) {
    browserSync.reload();

    cb();
}

module.exports = {
    default: series(cleanDist, copyHtml, copyVendorsCss, copyVendorsJs, copyCss, copyJs, startServer),
    build: series(cleanDist, copyHtml, copyVendorsCss, copyVendorsJs, copyCss, copyJs),
};
