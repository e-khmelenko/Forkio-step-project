const gulp = require('gulp'),
    concat = require('gulp-concat'),
    uglify = require('gulp-uglify'),
    clean = require('gulp-clean'),
    cleanCSS = require('gulp-clean-css'),
    imagemin = require('gulp-imagemin'),
    sass = require("gulp-sass"),
    purgecss = require('gulp-purgecss'),
    autoprefixer = require('gulp-autoprefixer'),
    browserSync = require("browser-sync").create();

sass.compiler = require("node-sass");


const paths = {
    html: "./index.html",
    src: {
        scss: "./src/**/*.scss",
        js: "./src/**/*.js",
        img: "./src/**/*.png",
    },
    build: {
        css: "dist/css/",
        js: "dist/js/",
        img: "dist/img/",
        self: "dist/",
    },
};

// const autoprefixer = () => (
//     gulp.src('src/app.css')
//
//         .pipe(gulp.dest('dist'))
// )

const uglifyJS = () => (
    gulp.src(paths.src.js)
        .pipe(uglify())
        .pipe(gulp.dest("./src/js/"))
);

const buildJS = () => (
    gulp.src(paths.src.js)
        .pipe(concat("script.min.js"))
        .pipe(gulp.dest(paths.build.js))
        .pipe(browserSync.stream())
);

const purgeCSS = () => (
    gulp.src('dist/css/*.css')
        .pipe(purgecss({
            content: ['./**/*.html']
        }))
        .pipe(gulp.dest('dist/css'))
)
const CleanCSS = () => (
    gulp.src('dist/*.css')
        .pipe(cleanCSS({compatibility: 'ie8'}))
        .pipe(gulp.dest('dist/css'))
);
const buildCSS = () => (
    gulp.src(paths.src.scss)
        .pipe(sass({outputStyle: 'compressed'}).on("error", sass.logError))
        .pipe(autoprefixer({
            cascade: false
        }))
        .pipe(concat('style.min.css'))
        .pipe(gulp.dest(paths.build.css))
        .pipe(browserSync.stream())
);

const buildIMG = () => (
    gulp.src(paths.src.img)
        .pipe(imagemin())
        .pipe(gulp.dest(paths.build.img))
        .pipe(browserSync.stream())
);

const cleanBuild = () =>
    gulp.src(paths.build.self, {allowEmpty: true}).pipe(clean());

const build = gulp.series(buildCSS,purgeCSS, uglifyJS, buildJS);

const watcher = () => {
    browserSync.init({
        server: {
            baseDir: "./",
        },
    });

    gulp.watch(paths.src.scss, buildCSS).on("change", browserSync.reload);
    gulp.watch(paths.src.js, buildJS).on("change", browserSync.reload);
    gulp.watch(paths.src.img, buildIMG).on("change", browserSync.reload);
    gulp.watch(paths.html, build).on("change", browserSync.reload);
};

gulp.task("clean", cleanBuild);
gulp.task("buildCSS", buildCSS);
gulp.task("buildJS", buildJS);
gulp.task("buildIMG", buildIMG);
gulp.task("CleanCSS", CleanCSS);
gulp.task("dev", watcher);

gulp.task("build", gulp.series(cleanBuild, gulp.parallel(buildIMG, build)));

