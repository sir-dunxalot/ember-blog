'use strict';

module.exports = function addImports(app) {
  var bowerDir = app.bowerDirectory;

  app.import(bowerDir + '/normalize.css/normalize.css', {
    prepend: true,
    type: 'vendor'
  });

  app.import(bowerDir + '/responsive-nav/responsive-nav.js', {
    type: 'vendor'
  });

  app.import(bowerDir + '/responsive-nav/responsive-nav.css', {
    type: 'vendor'
  });

  app.import(bowerDir + '/modernizr/modernizr.js', {
    type: 'vendor'
  });

  app.import('vendor/modernizr-tests.js');
}
