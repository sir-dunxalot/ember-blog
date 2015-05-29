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

function BlogFixturesCompiler(inputTree, options, templateCompiler) {
  if (!(this instanceof BlogFixturesCompiler)) {
    return new BlogFixturesCompiler(inputTree, options, templateCompiler);
  }

  CachingWriter.apply(this, [inputTree, options]); // this._super();

  this.inputTree = inputTree;
  this.options = options;
  this.templateCompiler = templateCompiler;
  this.authorsFixtures = null;
  this.categoriesFixtures = null;
  this.postsFixtures = [];
}

BlogFixturesCompiler.prototype = Object.create(CachingWriter.prototype);
BlogFixturesCompiler.prototype.constructor = BlogFixturesCompiler;

BlogFixturesCompiler.prototype.updateCache = function(srcDir, destDir) {
  var _this = this;
  var options = _this.options;

  var filePaths = walkSync(srcDir);
  var fileOptions = options.fileOptions;
  var fixturesDir  = path.join(destDir, options.appName, options.fixturesDir);
  var templatesDir = path.join(destDir, options._templatesDir);
  var templateCompiler = _this.templateCompiler;

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
    var dirPath, post, precompiledTemplate, relativePath, templatePath;

    if (isDirectory) {
      dirPath = path.join(destDir, filePath);

       if (!fs.exists(dirPath)) {
        mkdirp.sync(dirPath);
      }
    } else {
      post = fs.readFileSync(srcPath, fileOptions);
      post = postParser.newPost(post);

      relativePath = templatesDir + '/' + post['urlString'];
      precompiledTemplate = 'export default ' + templateCompiler.precompile(post['body']);
      templatePath = relativePath + '.js';

      fs.writeFileSync(templatePath, precompiledTemplate, fileOptions);

      _this.postsFixtures.push(post);
    }
  });

  /* Setup categories fixtures after posts have been passed */

  _this.authorsFixtures = postParser.authorsFixtures;
  _this.categoriesFixtures = postParser.categoriesFixtures;

  /* Write fixtures files (even if they are empty) */

  ['authors', 'categories', 'posts'].forEach(function(name) {
    var fixtures = _this[name + 'Fixtures'];
    var fileContents = 'export default ' +  JSON.stringify(fixtures) + ';';
    var fileName = path.join(fixturesDir, name + '.js');

    fs.writeFileSync(fileName, fileContents, fileOptions);
  });

}

module.exports = BlogFixturesCompiler;
