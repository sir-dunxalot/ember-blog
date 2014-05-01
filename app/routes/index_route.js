'use strict';

App.IndexRoute = Em.Route.extend({

  model: function(params) {
    var posts = this.store.all('post');
    return posts;
  },
});
