const path = require("path");

module.exports = {
  hooks: {
    doTheme: 'do_theme',
    loadData: 'load_data'
  },
  paths: {
    project: path.join(__dirname, "../../../../"),
    templates: `${path.join(__dirname, "../../../../")}src/templates`,
    pages: `${path.join(__dirname, "../../../../")}src/templates/pages`,
    components: `${path.join(__dirname, "../../../../")}src/templates/components`,
    moduleStyles: `${path.join(__dirname, "../../../../")}src/assets/scss/build`,
    moduleScripts: `${path.join(__dirname, "../../../../")}src/assets/js/build`,
    moduleScriptsComponents: `./../../../templates/components`,
    data: `${path.join(__dirname, "../../../../")}src/data`,
    public: `${path.join(__dirname, "../../../../")}public`,
  },
  formats: {
    scss: "/**/*.scss",
    template: "/*.njk",
    partial: "/**/*.njk"
  },
  dbFile: "db.json",
  defaultHomePage: "home"
};