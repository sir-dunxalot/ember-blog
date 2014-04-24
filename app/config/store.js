'use strict';

module.exports = (function() {

  App.ApplicationStore = DS.Store.extend({
    revision: 13
  });

  App.ApplicationAdapter = DS.FixtureAdapter.extend();

}());
