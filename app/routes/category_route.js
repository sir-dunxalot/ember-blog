'use strict';

App.CategoryRoute = Ember.Route.extend({
  posts: [],

  // Category data
  model: function(params) {
    var category = this.store.find('category', params.category_name);
    return category;
  },

  // Posts data
  afterModel: function(params) {
    var _this = this;

    return this.store.filter('post', function(post) {
      var categories = post.get('categories');
      var pageCategory = params.get('name').toLowerCase();

      return categories.indexOf(pageCategory) > -1;
    }).then(function(result) {
      _this.set('posts', result.content);
    });
  },

  // URL
  serialize: function(model) {
    var obj = { category_name: model.get('name').dasherize() };
    return obj;
  },

  setupController: function() {
    var posts = this.get('posts');
    this.controller.set('posts', posts);
  },

});
