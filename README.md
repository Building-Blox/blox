# Blox

A Javascript library to help build highly modular static websites.

For an example of how Blox can be used in a project, see the [Blox Theme Demo project](https://github.com/building-blox/blox-theme-demo).

## Dependencies
- Nunjucks
- Sass
- Gulp

## Usage
In your project's ```gulpfile.js```, add:
````
const Blox = require("@building-blox/blox");

const blox = new Blox(gulp, {
  homePage: "home",
  dataUrl: process.env.DATA_URL,
});
````

Then build your project out with the following structure:
````
...
|--src
    |--assets
        |--images
        |--js
        |--scss
    |--data
        |--db.json
    |--templates
        |--components
        |--layout
            |--layout.njk
            |--layout.scss
        |--pages 
            |--home 
                |--index.njk
                |--home.js
                |--home.scss
|--gulpfile.js
...
````

## Data
Data in ```db.json``` will available in the Nunjucks template files via the ```blox.db``` global object.

### Actions
Actions allow you to be able to create your own implementations of some common use cases. Currently, you can add actions for:
- Loading data from an external source
- Creating theme CSS

An example of this is in the [Blox Theme Demo's](https://github.com/building-blox/blox-theme-demo/blob/master/gulpfile.js) ```gulpfile.js```:

````
//add actions
blox.addAction("do_theme", require("./actions/theme").doTheme);
blox.addAction("load_data", require("./actions/loadData"));
````