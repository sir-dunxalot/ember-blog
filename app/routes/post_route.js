'use strict';

App.PostRoute = Em.Route.extend({

  model: function(params) {
    var post = this.store.find('post', params.post_url);
    return post;
  },

  // URL
  serialize: function(model) {
    var obj = { post_url: model.get('title').dasherize() };
    return obj;
  },

});
