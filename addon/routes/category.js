import Em from 'ember';

export default Em.Route.extend({

  model: function(params) {
    return this.store.find('category', { urlString: params.urlString });
  },

  serialize: function(model) {
    return { urlString: model.get('urlString') };
  },

  setupController: function(controller, model) {
    var category = model.get('content.firstObject');

    if (category) {
      controller.set('model', category);
    } else {
      this.transitionTo('catchall', 'category-not-found');
    }
  },

});
