import Ember from 'ember';

export default Ember.Route.extend({

  model: function(params) {
    return this.store.find('post', { urlString: params.urlString });
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
