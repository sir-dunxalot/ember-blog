'use strict';

module.exports = App.ApplicationRoute = Ember.Route.extend({

  // Load each post and add it to the fixtures
  setupController: function(controller, model) {
    var _this = this;
    var postIndex = 1;

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

      // Set url for routing
      url = title.dasherize();
      post['url'] = url;

      _this.store.createRecord('post', post);

      postIndex++;
    });
  },

});
