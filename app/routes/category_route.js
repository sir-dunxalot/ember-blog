'use strict';

App.CategoryRoute = Ember.Route.extend({
  posts: [],

  // Category data
  model: function(params) {
    var store = this.get('store');
    var category = store.find('category', { name: params.name });
    return category;
  },

  // Posts data
  // afterModel: function(params) {
  //   var _this = this;
  //   var model = this.get('model');

  //   // console.log(model);


  // },

  // URL
  serialize: function(model, params) {
    // console.log(params);
    // console.log(model.get(''));
    var obj = { category_name: model.get('name') };
    return obj;
  },

  setupController: function(controller, model) {
    var _this = this;
    var category = model.get('content')[0];
    var categoryName = category.get('name');

    var posts = this.store.filter('post', function(post) {
      var categories = post.get('categories');

      return categories.indexOf(categoryName) > -1;
    }).then(function(result) {
      // _this.set('posts', result.content);
      _this.controller.set('posts', result.content);
    });

    var posts = this._getPosts(categoryName);
    this.controller.set('posts', posts);
  },

  _getPosts: function(categoryName) {


    // return this.store.filter('post', function(post) {
    //   var categories = post.get('categories');

    //   return categories.indexOf(categoryName) > -1;
    // }).then(function(result) {
    //   _this.set('posts', result.content);
    // });
  },

});
