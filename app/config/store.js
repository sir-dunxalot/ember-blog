'use strict';

module.exports = (function() {

  App.Store = DS.Store.extend({
    revision: 13
  });

  App.ApplicationAdapter = DS.FixtureAdapter.extend();

}());
