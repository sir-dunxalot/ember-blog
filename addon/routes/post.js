import Em from 'ember';

export default Em.Route.extend({

  model: function(params) {
    return this.store.find('post', { urlString: params.urlString });
  },

  serialize: function(model) {
    return { urlString: model.get('urlString') };
  },

  setupController: function(controller, model) {
    var post = model.get('content.firstObject');

    if (post) {
      controller.set('model', post);
    } else {
      this.transitionTo('catchall', 'post-not-found');
    }
  },
});
