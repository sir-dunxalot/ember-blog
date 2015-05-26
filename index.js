/* jshint node: true */

'use strict';

/* Dependencies */

var mergeObjects = require('deepmerge');
var Funnel = require('broccoli-funnel');
var mergeTrees = require('broccoli-merge-trees');

/* Library */

var defaultOptions = require('./lib/default-options');
var fixturesCompiler = require('./lib/fixtures-compiler');
var logger = require('./lib/logger');

module.exports = {
  name: 'ember-blog',

  /* Private variables */

  _app: null,
  _htmlbarsPlugin: null,
  _templateCompiler: null,
  _templatesDir: null,

  /* Setup and run everything */

  included: function(app) {
    var _this = this;
    var fixturesOptions = {
      appName: app.name,
    };

    this._app = app;

    this._super.included(app);
    this.setOptions();

    if (this.enabled) {

      ['fileOptions',
        'fixturesDir',
        '_templatesDir'].forEach(function(option) {
        fixturesOptions[option] = _this[option];
      });

      /* Add posts and categories fixtures */

      app.registry.add('js', {
        name: 'blog-fixtures',
        ext: 'md', // Not sure this does anything

        /* https://github.com/stefanpenner/ember-cli/blob/master/lib/preprocessors/javascript-plugin.js */

        toTree: function(tree) {
          var templateCompiler = _this._templateCompiler;
          var posts = new Funnel(tree, {
            include: [new RegExp(/\/posts\/.*.md$/)]
          });
          var fixturesTree = fixturesCompiler(posts, fixturesOptions, templateCompiler);

          return mergeTrees([tree, fixturesTree], {
            overwrite: true
          });
        }
      });
    } else {
      logger.warning(this.name + ' is not enabled.');
    }

  },

  setOptions: function() {
    var overridingOptions = this._app.options.blog || {};
    var options =  mergeObjects(defaultOptions, overridingOptions);

    this._templatesDir = '/' + this._app.name + '/templates';

    for (var option in options) {
      this[option] = options[option];
    }
  },

  setupPreprocessorRegistry: function(type, registry) {
    var templatePlugins = registry.load('template');
    var htmlbarsPlugin;

    if (!templatePlugins.length) {
      return;
    }

    htmlbarsPlugin = templatePlugins[0];

    this._templateCompiler = htmlbarsPlugin;
  },

};
