/** !
 * @fileOverview A Javascript library for easily creating static websites. BuildingBlox
 * manages project template files for generation of an optimised public directory. Apart from the
 * use of Nunjucks, BuildingBlox is unopinionated, leaving felxibility for the developer to specify
 * dependencies.
 * @version 0.1.0
 * @license
 * Copyright (c) 2019 Richard Lovell
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the 'Software'), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */
(function () {
  "use strict";


  const path = require("path");
  const fs = require("fs");
  const fsUtils = require("./util/fs-util");
  const constants = require("./lib/constants");
  const templates = require("./lib/templates");
  const scripts = require("./lib/scripts");
  const hooks = require("./lib/hooks");

  /**
   * Blox class. Prepares building blocks for static site generation including pages,
   * partials and components. Connects styles, scripts and images for each block.
   */
  class Blox {
    constructor(gulp, options = {}) {
      this.gulp = gulp;
      this.options = options;
      this.globalData;
      this.assignTasks();
      this.nunjucksOptions = {
        path: [constants.paths.project, "build/css/"],
      };
    }

    addAction(name, action) {
      if (!hooks.names[name]) hooks.names[name] = [];
        hooks.names[name].push(action);
    }

    /**
     * Set up Gulp tasks.
     */
    async assignTasks() {
      let self = this;
      this.gulp.task("blox:build", (done) =>
        self.gulp.series("blox:load", "blox:run")(done)
      );

      this.gulp.task("blox:dev", (done) => self.gulp.series("blox:run")(done));

      this.gulp.task("blox:load", async function (done) {
        await hooks.loadDataHook(self.options, self.globalData);
        done();
      });

      this.gulp.task("blox:run", function (done) {
        self.run().then(function () {
          done();
        });
      });
    }

    /**
     * Get the data ready for templating.
     * Data is retrieved from all files kept in the data directory.
     */
    async init() {
      return new Promise(async (resolve, reject) => {
        this.dirs = await fsUtils.getDirectories(constants.paths.pages);
        fs.readdir(constants.paths.data, (err, files) => {
          if (err) reject(err);
          let dataArray = [];
          files.forEach((file) => {
            let content = require(`${constants.paths.data}/${file}`);
            if (file === constants.dbFile) {
              content = { db: content };
            }
            dataArray.push(content);
          });
          this.globalData = {
            blox: dataArray.reduce(function (result, current) {
              return Object.assign(result, current);
            }, {}),
          };
          this.globalData.blox.page = {
            headElements: [],
          };
          resolve();
        });
      });
    }

    /**
     * Run Blox.
     */
    async run() {
      await Promise.all([
        await this.init(),
        await hooks.doThemeHook(this.options, this.globalData),
        await scripts.doComponentScripts(),
        await this.doGlobalScripts(),
        await this.doTemplates(),
      ]);
    }

    async doGlobalScripts() {
      await scripts.doScripts({
        gulp: this.gulp,
        source: `${path.join(__dirname, "../../../")}src/assets/js/index.js`,
        dest: `${path.join(__dirname, "../../../")}public/js`,
      });
    }

    /**
     * Setup and page templates.
     */
    async doTemplates() {
      await Promise.all([
        await this.doMasterTemplates(),
        await this.doDetailTemplates(),
      ]);
    }

    /**
     * Setup and render master page templates.
     */
    async doMasterTemplates() {
      await templates.doPages({
        gulp: this.gulp,
        options: this.options,
        dirs: this.dirs,
        globalData: this.globalData,
      });
    }

    /**
     * Setup and render detail page templates.
     */
    async doDetailTemplates() {
      for (let i = 0; i < this.dirs.length; i++) {
        const dir = this.dirs[i];
        let subdirs = await fsUtils.getDirectories(
          constants.paths.pages + "/" + dir
        );
        // find a subfolder with the name "detail"
        for (let i = 0; i < subdirs.length; i++) {
          let subdir = subdirs[i];
          if (subdir === "detail") {
            if (this.globalData.blox.db[dir].items) {
              await templates.doDetailPages({
                gulp: this.gulp,
                options: this.options,
                globalData: this.globalData,
                dir: dir,
                subdir: subdir,
              });
            }
          }
        }
      }
    }
  }

  module.exports = Blox;
})();
