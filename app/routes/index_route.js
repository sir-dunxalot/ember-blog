'use strict';

App.IndexRoute = Ember.Route.extend({

  model: function() {
    var posts = this.store.all('post');
    return posts;
  },
});
