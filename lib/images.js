const path = require("path");
const constants = require("./constants");
const flatten = require("gulp-flatten");

module.exports = {
  doComponents: async function (args) {
      args.gulp.src([`${constants.paths.components}/**/*.{gif,jpg,png,svg}`])
      .pipe(flatten({ includeParents: 0 }))
      .pipe(args.gulp.dest(`${constants.paths.public}/assets/images`));
  },
  doPartials: async function (args) {
    args.gulp.src([`${constants.paths.pages}/**/partials/**/images/*.{gif,jpg,png,svg}`])
    .pipe(flatten({ includeParents: 0 }))
    .pipe(args.gulp.dest(`${constants.paths.public}/assets/images`));
}
};