const constants = require("./constants");
const fsUtils = require("../util/fs-util");

module.exports = {
    names: {},
    doThemeHook: async function(options, globalData) {
      return new Promise(async (resolve) => {
        this.doHook(constants.hooks.doTheme, options, globalData);
        resolve();
      });
    },
    loadDataHook: async function(options, globalData) {
      return new Promise(async (resolve) => {
        let hasDataFile = await fsUtils.hasDataFile();
        if (hasDataFile) {
          if (!options.dataUrl && !argv.dataUrl) {
            throw new Error("Blox: No data URL provided");
          }
          console.log(
            info("Blox: Fetching remote data from " + this.options.dataUrl)
          );
          this.doHook(constants.hooks.loadData, options, globalData);
        } else {
          console.log(info("Blox: Data not loaded - no db.json file found"));
          resolve();
        }
        
        resolve();
      });
    },
    doHook: async function(hookName, options, globalData) {
      return new Promise(async (resolve) => {
        if (this.names[hookName]) {
          let config = {
            options: options,
            globalData: globalData,
          };
          this.names[hookName].forEach((action) => action(config));
        }
        resolve();
      });
    }
};
