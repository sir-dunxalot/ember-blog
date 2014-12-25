module.exports = function addImports(app) {
  var bowerDir = app.bowerDirectory;

  app.import(bowerDir + '/normalize.css/normalize.css');
  app.import(bowerDir + '/responsive-nav/responsive-nav.js');
  app.import(bowerDir + '/responsive-nav/responsive-nav.css');
  app.import(bowerDir + '/modernizr/modernizr.js');
  app.import('vendor/modernizr-tests.js');
}
