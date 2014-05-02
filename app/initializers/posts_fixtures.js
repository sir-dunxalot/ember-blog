'use strict';

Em.Application.initializer({
  name: 'postsFixtures',

  initialize: function(container, application) {
    var postIndex = 1;

    // Load each post and add it to the fixtures with post model
    window.require.list().filter(function(module) {
      return new RegExp('^posts/').test(module);
    }).forEach(function(module) {
      var post = require(module);
      var title = post.title;
      var published, store, newPost;

      // Add index to object (required for Ember fixtures)
      post['id'] = postIndex;

      // Add string to model for link-to helpers and url serialization
      post['urlString'] = title.dasherize();

      // Rename content for model (can't start with an underscore and content is reserved)
      post['body'] = post['__content'];
      delete post['__content'];

      // Convert JS date to Date object for Ember model DS.attr('date')
      post['publishedObject'] = new Date(post['published']);

      store = container.lookup('store:main')
      newPost = store.createRecord('post', post);
      newPost.save();

      postIndex++;
    });
  },
})
