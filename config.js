exports.config = {
  paths: {
    public: './local',
    watched: ['app', 'envs', 'vendor', 'test']
  },
  files: {
    javascripts: {
      joinTo: {
        'javascripts/app.js': /^(app|envs\/development)/,
        'javascripts/vendor.js': /^(vendor\/scripts\/(common|development)|vendor\\scripts\\(common|development))/,
      },
      order: {
        before: [
          'vendor/scripts/common/console-polyfill.js',
          'vendor/scripts/common/jquery.js',
          'vendor/scripts/common/handlebars.js',
          'vendor/scripts/development/ember.js',
          'vendor/scripts/development/ember-data.js',
          'vendor/scripts/common/modernizr-custom.js',
          'vendor/scripts/common/bootstrap/tooltip.js'
        ]
      },
    },
    stylesheets: {
      joinTo: {
        'stylesheets/app.css': /^(app|vendor)/
      },
    },
    templates: {
      precompile: true,
      root: 'templates',
      joinTo: {
        'javascripts/app.js': /^app/
      }
    }
  },
  conventions: {
    ignored: function(path) {
      var sep, startsWith;
      var sysPath = require('path');

      startsWith = function(string, substring) {
        return string.indexOf(substring, 0) === 0;
      };

      sep = sysPath.sep;

      // Regular Brunch ignoring for Ember
      if (path.indexOf("app" + sep + "templates" + sep) === 0) {
        return false;
      } else {
        return startsWith(sysPath.basename(path), '_');
      }
    }
  },
  plugins: {
    sass: {
      options: ['--compass']
    }
  },
  overrides: {
    production: {
      paths: {
        public: './',
      },
      files: {
        javascripts: {
          joinTo: {
            'javascripts/app.js': /^(app|envs\/production)/,
            'javascripts/vendor.js': /^(vendor\/scripts\/(common|production)|vendor\\scripts\\(common|production))/
          },
          order: {
            before: [
              'vendor/scripts/common/console-polyfill.js',
              'vendor/scripts/common/jquery.js',
              'vendor/scripts/common/handlebars.js',
              'vendor/scripts/production/ember.js',
              'vendor/scripts/production/ember-data.js',
              'vendor/scripts/common/modernizr-custom.js',
              'vendor/scripts/common/bootstrap/tooltip.js'
            ]
          }
        }
      },
      optimize: true,
      sourceMaps: false,
      plugins: {
        autoReload: {
          enabled: false
        },
      },
    },
  },
};
