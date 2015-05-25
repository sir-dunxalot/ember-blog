'use strict';

/* Dependencies */

var CachingWriter = require('broccoli-caching-writer');
// var HtmlbarsCompiler = require('ember-cli-htmlbars');
var htmlbars = require('htmlbars');
var fs = require('fs');
var mkdirp = require('mkdirp');
var postParser = require('./post-parser');
var path = require('path');
var walkSync = require('walk-sync');

function OctosmashedFixturesCompiler(inputTree, options, precompiler) {
  if (!(this instanceof OctosmashedFixturesCompiler)) {
    return new OctosmashedFixturesCompiler(inputTree, options);
  }

  CachingWriter.apply(this, arguments); // this._super();

  this.inputTree = inputTree;
  this.options = options;
  this.categoriesFixtures = null;
  this.postsFixtures = [];
}

OctosmashedFixturesCompiler.prototype = Object.create(CachingWriter.prototype);
OctosmashedFixturesCompiler.prototype.constructor = OctosmashedFixturesCompiler;

OctosmashedFixturesCompiler.prototype.updateCache = function(srcDir, destDir) {
  var _this = this;
  var options = _this.options;

  var filePaths = walkSync(srcDir);
  var fileOptions = options.fileOptions;
  var fixturesDir  = path.join(destDir, options.appName, options.fixturesDir);
  var templatesDir = path.join(destDir, options._templatesDir);

  if (!filePaths.length) {
    return;
  }

  /* Check that all necessary directories exist */

  [fixturesDir, templatesDir].forEach(function(dir) {
    if (!fs.exists(dir)) {
      mkdirp.sync(dir);
    }
  });

  /* Parse each post and setup fixtures */

  filePaths.forEach(function(filePath) {
    var srcPath  = path.join(srcDir[0], filePath);
    var isDirectory = srcPath.slice(-1) === '/';
    var dirPath, post, template, templatePath;

    if (isDirectory) {
      dirPath = path.join(destDir, filePath);

       if (!fs.exists(dirPath)) {
        mkdirp.sync(dirPath);
      }
    } else {
      post = fs.readFileSync(srcPath, fileOptions);
      post = postParser.newPost(post);

      var relativePath = templatesDir + '/' + post['urlString'];

      template = "import Ember from 'ember';\n" + 'export default Ember.HTMLBars.template(';
      var precompiledTemplate = htmlbars.compileSpec(post['body'], {
        // isHTMLBars: true,
        moduleName: relativePath
      });

      template = template + precompiledTemplate + ');';

      templatePath = relativePath + '.js';

      fs.writeFileSync(templatePath, template, fileOptions);

      _this.postsFixtures.push(post);
    }
  });

  /* Setup categories fixtures after posts have been passed */

  _this.categoriesFixtures = postParser.categoriesFixtures;

  /* Write fixtures files */

  ['categories', 'posts'].forEach(function(name) {
    var fixtures = _this[name + 'Fixtures'];
    var fileContents = 'export default ' +  JSON.stringify(fixtures) + ';';
    var fileName = path.join(fixturesDir, name + '.js');

    fs.writeFileSync(fileName, fileContents, fileOptions);
  });

}

module.exports = OctosmashedFixturesCompiler;
