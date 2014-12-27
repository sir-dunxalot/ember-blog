'use strict';

/* Dependencies */

var mergeObjects = require('deepmerge');
var Funnel = require('broccoli-funnel');
var mergeTrees = require('broccoli-merge-trees');

/* Library */

var addImports = require('./lib/add-imports');
var defaultOptions = require('./lib/default-options');
var fixturesCompiler = require('./lib/fixtures-compiler');
var logger = require('./lib/logger');

module.exports = {
  name: 'octosmashed',

  /* Private variables */

  _app: null,
  _templatesDir: null,

  included: function(app) {
    var _this = this;
    var fixturesOptions = {};

    this._app = app;

    this._super.included(app);
    this.setOverridingOptions();
    addImports(app);

    ['fileOptions',
      'fixturesDir',
      '_templatesDir'].forEach(function(option) {
      fixturesOptions[option] = _this[option];
    });

    if (this.enabled) {
      app.registry.add('js', {
        name: 'octosmashed-fixtures',
        ext: 'md', // TODO - does this do anything?

        /* https://github.com/stefanpenner/ember-cli/blob/master/lib/preprocessors/javascript-plugin.js */

        toTree: function(tree) {
          var posts = new Funnel(tree, {
            include: [new RegExp(/\/posts\/.*.md$/)]
          });
          var fixturesTree = fixturesCompiler(posts, fixturesOptions);

          return mergeTrees([tree, fixturesTree], {
            overwrite: true
          });
        }
      });
    } else {
      logger.warn(this.name + ' is not enabled.');
    }

  },

  setOverridingOptions: function() {
    var overridingOptions = this._app.options.octosmashed || {};
    var options =  mergeObjects(defaultOptions, overridingOptions);

    this._templatesDir = '/' + this._app.name + '/templates';

    for (var option in options) {
      this[option] = options[option];
    }
  },

};
