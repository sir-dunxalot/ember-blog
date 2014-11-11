import Em from 'ember';

export default Em.Route.extend({

  model: function(params) {
    return this.store.find('post', { urlString: params.urlString });
  },

  serialize: function(model) {
    return { urlString: model.get('urlString') };
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
