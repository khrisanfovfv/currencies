const {src, dest, watch, parallel, series} = require('gulp');
const scss = require('gulp-sass')(require('sass'));
const concat = require('gulp-concat');
const uglify = require('gulp-uglify-es').default;
const browserSync = require('browser-sync').create();
const autoprefixer = require('gulp-autoprefixer');

const clean = require('gulp-clean');
const imagemin = require('gulp-imagemin');

const destFolder = 'C:/OSPanel/domains/currencies/wp-content/themes/currencies/';

function images(){
    return src(['app/images/src/*.*', '!app/images/src/*.svg'])
    .pipe(src('app/images/src/*.*'))
    .pipe(imagemin())
    .pipe(dest(destFolder +'images/'))
}

function screenshot(){
    return src('screenshot.png')
    .pipe(dest(destFolder))
}

function main_style(){
    return src('style.css')
    .pipe(dest(destFolder))
}

function php(){
    return src([
       'app/*.php' 
    ])
    .pipe(dest(destFolder))
}





function scripts(){
    return src([
        'node_modules/jquery/dist/jquery.js',
        'app/js/currency.js',
        'app/js/main.js'
    ])
    .pipe(concat('main.min.js'))
    .pipe(uglify())
    .pipe(dest(destFolder + 'js/'))
    .pipe(browserSync.stream())
}


function styles(){
    return src(['app/scss/style.scss'])
    .pipe(autoprefixer({overrideBrowserslist: ['last 10 version']}))
    .pipe(concat('style.min.css'))
    .pipe(scss({outputStyle: 'expanded'}))
    .pipe(dest(destFolder + '/css'))
    .pipe(browserSync.stream()) 
}



function watching(){
    watch(['app/scss/*.scss','app/plugins/**/*.scss'], styles)
    watch(['app/js/*'], scripts)
    watch(['app/**/*.php'], php).on('change', browserSync.reload)
}

function browsersync(){
    browserSync.init({
        proxy: {
            target: 'http://currencies',
            ws: true
          },
          reloadDelay: 2000
    });

}

function cleanDist(){
    return src('dist')
    .pipe(clean())
}

function building(){
    return src([
        'app/css/style.min.css',
        'app/js/main.min.js',
        'app/*html'
    ], {base : 'app'})
    .pipe(dest('dist'))
}

exports.styles = styles;
exports.scripts = scripts;
exports.images = images;
exports.php = php;
exports.screenshot = screenshot;


exports.watching = watching;
exports.browsersync = browsersync;
exports.build = series(cleanDist, building);

exports.default = parallel(php, styles, scripts, screenshot, main_style, browsersync, watching);