const gutil = require("gulp-util");
const sass = require("gulp-sass"),
concat = require('gulp-concat'),
  postcss = require("gulp-postcss"),
  scss = require("postcss-scss"),
  autoprefixer = require("autoprefixer"),
  postcssProcessors = [
    autoprefixer(),
  ];
const fs = require("fs");
const fsUtils = require("../util/fs-util");
const path = require("path");

const rename = require("gulp-rename");
const constants = require("./constants");

module.exports = {
  /**
   * Process page styles.
   */
  doPage: async function (args) {
    args.gulp
      .src(args.source, { allowEmpty: true })
      .pipe(postcss(postcssProcessors, { syntax: scss }))
      .pipe(sass({ outputStyle: "compressed" }).on("error", gutil.log))
      .pipe(rename(`styles.min.css`))
      .pipe(args.gulp.dest(args.dest));
  },
  doComponents: async function (args) {
    let format = constants.formats.scss;
    args.gulp
      .src([path.join(args.source, format)], { allowEmpty: true })
      .pipe(concat(args.fileName))
      .pipe(args.gulp.dest(constants.paths.moduleStyles));
  }
};
