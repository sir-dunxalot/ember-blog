'use strict';

module.exports = App.IndexRoute = Ember.Route.extend({

  model: function() {
    var _this = this;
    var postIndex = 1;

    // Load each post and add it to the fixtures with post model
    window.require.list().filter(function(module) {
      return new RegExp('^posts/').test(module);
    }).forEach(function(module) {
      var post = require(module);

      // Add index to object (required for Ember fixtures)
      post['id'] = postIndex;

      // Rename content for model (can't start with an underscore)
      post['content'] = post['__content'];
      delete post['__content'];

      console.log(post);
      _this.store.createRecord('post', post);

      postIndex++;
    });

    return this.store.find('post');
  },

});
