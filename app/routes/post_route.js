'use strict';

App.PostRoute = Em.Route.extend({

  model: function(params) {
    var post = this.store.find('post', { urlString: params.urlString });
    return post;
  },

  // URL
  serialize: function(model) {
    var obj = { urlString: model.get('urlString') };
    return obj;
  },

  setupController: function(controller, model) {
    var post = model.get('content')[0];

    if (!post) {
      this._postNotFound();
    } else {
      controller.set('content', post);
    }
  },

  _postNotFound: function() {
    this.transitionTo('catchall', 'post-not-found');
  },

});
