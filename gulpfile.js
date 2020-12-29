
const { src, watch, dest, parallel, series } = require('gulp');
const browserSync = require('browser-sync').create();
const sass = require('gulp-sass');
const pug = require('gulp-pug');
const rimraf = require('rimraf');

let distDir = './dist';
const GH_PAGES_DIST = './gh-pages';
const SRC_DIR = './src';

const GH_PAGES_ROOT = '/cat-store';
let rootDir = '';


function serve() {
  browserSync.init({
    server: {
      baseDir: distDir
    }
  });

  build();
  watch(`${SRC_DIR}/**/*.js`, script);
  watch(`${SRC_DIR}/**/*.scss`, style);
  watch(`${SRC_DIR}/**/*.pug`, markup);
  watch(`${SRC_DIR}/assets/**/*`, assets);
};

function style() {
  return src(`${SRC_DIR}/styles/style.scss`)
    .pipe(sass())
    .pipe(dest(distDir))
    .pipe(browserSync.stream());
};

function script() {
  return src(`${SRC_DIR}/script/script.js`)
    .pipe(dest(distDir))
    .pipe(browserSync.stream());
}

function markup() {
  return src(`${SRC_DIR}/pages/**/*pug`)
    .pipe(pug({
      basedir: SRC_DIR,
      pretty: true,
      data: {
        rootDir
      }
    }))
    .pipe(dest(distDir))
    .pipe(browserSync.stream());
};

function assets() {
  return src(`${SRC_DIR}/assets/**/*`)
    .pipe(dest(`${distDir}/assets`))
    .pipe(browserSync.stream());
}

function cleanup(cb) {
  rimraf.sync(distDir);
  cb();
}

const build = series([
  cleanup,
  parallel([markup, style, assets, script])
]);

function ghPages(cb) {
  rootDir = GH_PAGES_ROOT;
  distDir = GH_PAGES_DIST;

  build();
  cb();
}

exports.default = serve;
exports.build = build;
exports.ghPages = ghPages;
