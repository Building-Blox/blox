const path = require("path");

module.exports = {
  hooks: {
    doTheme: 'do_theme',
    loadData: 'load_data'
  },
  paths: {
    project: path.join(__dirname, "../../../"),
    templates: `${path.join(__dirname, "../../../")}src/templates`,
    pages: `${path.join(__dirname, "../../../")}src/templates/pages`,
    components: `${path.join(__dirname, "../../../")}src/templates/components`,
    componentStyles: `${path.join(__dirname, "../../../")}src/assets/scss/dist`,
    data: `${path.join(__dirname, "../../../")}src/data`,
    public: `${path.join(__dirname, "../../../")}public`,
  },
  formats: {
    scss: "/**/*.scss",
    template: "/*.njk",
    partial: "/**/_*.njk"
  },
  dbFile: "db.json"
};