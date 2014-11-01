'use strict';

module.exports = {
  name: 'octosmashed',

  included: function(app) {
    this._super.included(app);

    app.import(app.bowerDirectory + '/responsive-nav/responsive-nav.js');
    app.import(app.bowerDirectory + '/responsive-nav/responsive-nav.css');
    app.import(app.bowerDirectory + '/modernizr/modernizr.js');
    app.import('vendor/modernizr-tests.js');
  }
};
