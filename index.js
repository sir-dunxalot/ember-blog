'use strict';

/* Dependencies */

var Funnel = require('broccoli-funnel');
var mergeTrees = require('broccoli-merge-trees');

/* Library */

var addImports = require('./lib/add-imports');
var createFixtures = require('./lib/create-fixtures');
var logger = require('./lib/logger');

module.exports = {
  name: 'octosmashed',

  /* Public variables*/

  app: null,
  templatesDir: null,

  /* Default options */

  enabled: true,
  fileOptions: { encoding: 'utf8' },
  fixturesDir: 'fixtures',
  // postsFixturesFilename: 'posts-fixtures',
  // postsFixturesPath: 'posts-fixtures',

  included: function(app) {
    var _this = this;
    var fixturesOptions = {};

    this.app = app;

    this._super.included(app);
    this.setOverridingOptions();
    addImports(app);

    ['fileOptions',
      'fixturesDir',
      'templatesDir'].forEach(function(option) {
      fixturesOptions[option] = _this[option];
    });

    if (this.enabled) {
      app.registry.add('js', {
        name: 'octosmashed-posts-templates',
        ext: 'md',

        /* https://github.com/stefanpenner/ember-cli/blob/master/lib/preprocessors/javascript-plugin.js */

        toTree: function(tree) {
          var posts = new Funnel(tree, {
            include: [new RegExp(/\/posts\/.*.md$/)]
            // srcDir: postsDir,
            // include: [new RegExp(/^.*\.(md|hbs)$/)]
          });
          var fixturesTree = createFixtures(posts, fixturesOptions);

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
    var options = this.app.options.octosmashed || {};
    this.templatesDir = '/' + this.app.name + '/templates';

    for (var option in options) {
      this[option] = options[option];
    }
  },

};
