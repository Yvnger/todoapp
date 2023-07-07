const {src, dest, series, watch} = require('gulp');
const concat = require('gulp-concat');
const htmlMin = require('gulp-htmlmin');
const fileInclude = require('gulp-file-include');
const typograf = require('gulp-typograf');
const sass = require('gulp-sass')(require('sass'));
const autoPrefixer = require('gulp-autoprefixer');
const cleanCSS = require('gulp-clean-css');
const svgSprite = require('gulp-svg-sprite');
const imagemin = require('gulp-imagemin');
const webp = require('gulp-webp');
const ttf2woff = require('gulp-ttf2woff');
const ttf2woff2 = require('gulp-ttf2woff2');
const babel = require('gulp-babel');
const uglify = require('gulp-uglify-es').default;
const notify = require('gulp-notify');
const sourcemaps = require('gulp-sourcemaps');
const del = require('del');
const browserSync = require('browser-sync').create();

const clean = () => {
    return del(['dist']);
}

const resources = () => {
    return src('src/resources/**')
        .pipe(dest('dist'))
}

const styles = () => {
    return src('src/styles/main.scss')
        .pipe(sass().on('error', sass.logError))
        .pipe(concat('main.css'))
        .pipe(autoPrefixer({
            cascade: false
        }))
        .pipe(cleanCSS({
            level: 2
        }))
        .pipe(dest('dist/css'))
        .pipe(browserSync.stream())
};

const stylesMinify = () => {
    return src('src/styles/main.scss')
        .pipe(sass().on('error', sass.logError))
        .pipe(sourcemaps.init())
        .pipe(concat('main.min.css'))
        .pipe(autoPrefixer({
            cascade: false
        }))
        .pipe(cleanCSS({
            level: 2
        }))
        .pipe(sourcemaps.write())
        .pipe(dest('dist/css'))
        .pipe(browserSync.stream())
};

const htmlMinify = () => {
    return src('src/*.html')
        .pipe(fileInclude({
            prefix: '@@',
            basepath: '@file'
        }))
        .pipe(htmlMin({
            collapseWhitespace: true,
        }))
        .pipe(typograf({ locale: ['ru', 'en-US'] }))
        .pipe(dest('dist'))
        .pipe(browserSync.stream())
}


const svgSprites = () => {
    return src('src/images/svg/**/*.svg')
        .pipe(svgSprite({
            mode: {
                stack: {
                    sprite: '../sprite.svg'
                }
            }
        }))
        .pipe(dest('dist/images'))
}

const woff = () => {
    return src(['src/fonts/*.ttf'])
        .pipe(ttf2woff())
        .pipe(dest('dist/fonts'))
}

const woff2 = () => {
    return src(['src/fonts/*.ttf'])
        .pipe(ttf2woff2())
        .pipe(dest('dist/fonts'))
}

const scripts = () => {
    return src(['src/js/main.js',])
        .pipe(babel({
            presets: ['@babel/preset-env']
        }))
        .pipe(concat('main.js'))
        .pipe(uglify({
            toplevel: true
        }).on('error', notify.onError()))
        .pipe(dest('dist/js'))
        .pipe(browserSync.stream())
}

const scriptsMinify = () => {
    return src(['src/js/main.js',])
        .pipe(sourcemaps.init())
        .pipe(babel({
            presets: ['@babel/preset-env']
        }))
        .pipe(concat('main.min.js'))
        .pipe(sourcemaps.write())
        .pipe(dest('dist/js'))
        .pipe(browserSync.stream())
}

const watchFiles = () => {
    browserSync.init({
        server: {
            baseDir: 'dist'
        }
    })
}

const images = () => {
    return src(['src/images/**/*.jpg', 'src/images/**/*.png', 'src/images/*.svg', 'src/images/**/*.jpeg',])
        .pipe(imagemin([imagemin.gifsicle({interlaced: true}), imagemin.mozjpeg({
            quality: 85,
            progressive: true
        }), imagemin.optipng({optimizationLevel: 5}), imagemin.svgo({
            plugins: [{removeViewBox: true}, {cleanupIDs: false}]
        })]))
        .pipe(dest('dist/images'))
}

const webpConvert = () => {
    return src(['src/images/**/*.jpg', 'src/images/**/*.png', 'src/images/**/*.jpeg'])
        .pipe(webp())
        .pipe(dest('dist/images'))
}

watch('src/**/**.html', htmlMinify);
watch('src/styles/**/*.scss', stylesMinify);
watch('src/images/svg/**/*.svg', svgSprites);
watch('src/js/**/*.js', scripts);
watch('src/resources/**', resources);
watch('src/images/**', images);
watch('src/images/**', webpConvert);
watch('src/fonts/**', woff2);
watch('src/fonts/**', woff);

exports.styles = stylesMinify;
exports.clean = clean;
exports.scripts = scripts;
exports.htmlMinify = htmlMinify;

exports.default = series(clean, resources, htmlMinify, scripts, scriptsMinify, woff2, woff, styles, stylesMinify, images, webpConvert, svgSprites, watchFiles);