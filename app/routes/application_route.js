'use strict';

App.ApplicationRoute = Ember.Route.extend({

  model: function() {
    var categories = this.store.all('category');
    return categories;
  },

  // Load each post and add it to the fixtures
  setupController: function(controller, model) {
    var _this = this;
    var model = this.get('model');
    var postIndex = 1;

    this.set('categories', model);

    // Load each post and add it to the fixtures with post model
    window.require.list().filter(function(module) {
      return new RegExp('^posts/').test(module);
    }).forEach(function(module) {
      var post = require(module);
      var title = post.title;
      var url;

      // Add index to object (required for Ember fixtures)
      post['id'] = postIndex;

      // Rename content for model (can't start with an underscore and content is reserved)
      post['body'] = post['__content'];
      delete post['__content'];

      _this.store.createRecord('post', post);

      postIndex++;
    });
  },

});
