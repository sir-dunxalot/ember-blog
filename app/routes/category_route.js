'use strict';

App.CategoryRoute = Em.Route.extend({

  // Category data
  model: function(params) {
    var category = this.store.find('category', { name: params.name });
    return category;
  },

  // URL
  serialize: function(model, params) {
    var obj = { name: model.get('name') };
    return obj;
  },

  // Posts data
  setupController: function(controller, model) {
    var category = model.get('content')[0];
    var categoryName = category.get('name');

    controller.set('category', category);

    var posts = this.store.filter('post', function(post) {
      var categories = post.get('categories');

      return categories.indexOf(categoryName) > -1;
    }).then(function(result) {
      controller.set('posts', result.content);
    });
  },
});
