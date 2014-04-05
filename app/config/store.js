'use strict';

module.exports = App.Store = DS.Store.extend({
  revision: 13
});

App.ApplicationAdapter = DS.FixtureAdapter.extend();
