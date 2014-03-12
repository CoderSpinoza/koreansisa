'use strict';

var fs = require('fs');
/*
 * GET home page.
 */

module.exports = function (app) {
  fs.readdirSync(__dirname).forEach(function (file) {
    if (file !== "index.js" && file !== ".DS_Store") {
      var name = file.slice(0, file.length);
      require('./' + name)(app);
    }
  });
};

