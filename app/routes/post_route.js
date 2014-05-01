'use strict';

App.PostRoute = Em.Route.extend({

  model: function(params) {
    var post = this.store.find('post', { urlString: params.urlString });
    return post;
  },

  // URL
  serialize: function(model) {
    // console.log(model);
    var obj = { urlString: model.get('urlString') };
    return obj;
  },

  // watch: function() {
  //   console.log(this.get('model'));
  // }.observes('model'),

  setupController: function(controller, model) {
    var post = model.get('content')[0];
    controller.set('content', post);
  },

});
