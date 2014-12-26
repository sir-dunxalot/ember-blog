import Em from 'ember';

export default Em.Route.extend({

  // Category data
  model: function(params) {
    return this.store.find('category', { name: params.name });
  },

  // URL
  serialize: function(model) {
    return { name: model.get('name') };
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
