const gutil = require("gulp-util");
const fs = require("fs");
const path = require("path");

const data = require("gulp-data");
const concat = require("gulp-concat");
const nunjucksRender = require("gulp-nunjucks-render");

const constants = require('./constants');
const nunjucksOptions = {
  path: [constants.paths.templates, "build/css/"],
};

const styles = require("./styles");
const scripts = require("./scripts");

module.exports = {
  /**
   * Render the page templates.
   */
  doPages: async function (args) {
    let self = this;
    for (let i = 0; i < args.dirs.length; i++) {
      const dir = args.dirs[i];
      if(args.options.pages && !args.options.pages.includes(dir)){
        continue;
      }
      let pagePath =
      constants.paths.pages + "/" + dir;
      await styles.doComponents({ 
        gulp: args.gulp,
        source: `${pagePath}/partials`,
        fileName: '_page-components.scss'
      });
      let [hasScripts, hasPartial, hasStyles] = await Promise.all([
        await this.checkFiles(pagePath, this.hasScript),
        await this.checkFiles(pagePath, this.hasPartial),
        await this.checkFiles(pagePath, this.hasStyle),
      ]);
      
      let format = hasPartial === true ? constants.formats.partial : constants.formats.template;
      let dest =
        dir === args.options.homePage
          ? constants.paths.public
          : `${constants.paths.public}/${dir}`;
      if (hasStyles) {
        await styles.doPage({
          gulp: args.gulp,
          source: `${pagePath}/${dir}.scss`,
          dest: `${constants.paths.public}/${dir}`,
        });
      }
      if (hasScripts) {
        await scripts.doScripts({
          gulp: args.gulp,
          source: `${pagePath}/${dir}.js`,
          dest: `${constants.paths.public}/${dir}`,
        });
      }
      args.gulp
        .src([path.join(pagePath, format)])
        .pipe(
          data(async function () {
            args.globalData.blox.page.name = dir;
            args.globalData.blox.sitePath =
              dir === args.options.homePage ? "" : "../";
            args.globalData.blox.page.path =
              dir === args.options.homePage ? `${dir}/` : "";
            args.globalData.blox.page.hasStyles = hasStyles;
            args.globalData.blox.page.hasScripts = hasScripts;
            return args.globalData;
          }).on("error", gutil.log)
        )
        .pipe(concat("index.html"))
        .pipe(nunjucksRender(nunjucksOptions).on("error", gutil.log))
        .pipe(args.gulp.dest(dest));
    }
  },
  async doDetailPages(args) {
    const detailPagePath = path.join(
      constants.paths.pages,
      args.dir,
      "detail"
    );
    for (let j = 0; j < args.globalData.blox.db[args.dir].items.length; j++) {
      let item = args.globalData.blox.db[args.dir].items[j];
      let [hasScripts, hasPartial, hasStyles] = await Promise.all([
        await this.checkFiles(detailPagePath, this.hasScript),
        await this.checkFiles(detailPagePath, this.hasPartial),
        await this.checkFiles(detailPagePath, this.hasStyle),
      ]);
      let format = hasPartial === true ? constants.formats.partial : constants.formats.template;

      let dest = `${constants.paths.public}/${args.dir}/${
        item.slug
      }`;
      let sourceName = `${detailPagePath}/${args.dir}-detail`;
      if (hasStyles) {
        await styles.doPage({
          gulp: args.gulp,
          source: `${sourceName}.scss`,
          dest: dest,
        });
      }
      if (hasScripts) {
        await scripts.doScripts({
          gulp: args.gulp,
          source: `${sourceName}.js`,
          dest: dest,
        });
      }
      args.gulp
        .src(
          path.join(
            constants.paths.pages,
            args.dir,
            args.subdir,
            format
          )
        )
        .pipe(concat("index.html"))
        .pipe(
          data(function () {
            args.globalData.blox.item = item;
            args.globalData.blox.page.name = `${args.dir}-detail`;
            args.globalData.blox.page.hasStyles = hasStyles;
            args.globalData.blox.page.hasScripts = hasScripts;
            args.globalData.blox.sitePath = "../../";
            return args.globalData;
          }).on("error", gutil.log)
        )
        .pipe(nunjucksRender(nunjucksOptions).on("error", gutil.log))
        .pipe(
          args.gulp.dest(
            `${constants.paths.public}/${args.dir}/${
              item.slug
            }`
          )
        );
    }
  },
  checkFiles: function (path, has) {
    return new Promise(function (resolve, reject) {
      fs.readdir(path, (err, files) => {
        if (err) reject(err);
        for (let k = 0; k < files.length; k++) {
          if (has(files[k])) {
            resolve(true);
          }
        }
        resolve(false);
      });
    });
  },
  hasPartial: function (file) {
    return (
      file === "components" || 
      file === "partials" || 
      (file.startsWith("_") && file.endsWith(".njk"))
    );
  },
  hasStyle: function (file) {
    return file.endsWith(".scss");
  },
  hasScript: function (file) {
    return file.endsWith(".js");
  },
};
