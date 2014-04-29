'use strict';

module.exports = (function() {

  App.ApplicationStore = DS.Store.extend({
    revision: 13
  });

  App.ApplicationAdapter = DS.FixtureAdapter.extend({
    queryFixtures: function(fixtures, query, type) {
      return fixtures.filter(function(item) {
        for(var prop in query) {
          if( item[prop] != query[prop]) {
            return false;
          }
        }
        return true;
      });
    }
  });

}());
