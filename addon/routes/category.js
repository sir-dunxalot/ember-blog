import Em from 'ember';

export default Em.Route.extend({

  model: function(params) {
    return this.store.find('category', { urlString: params.urlString });
  },

  setupController: function(controller, model) {
    var category = model.get('content.firstObject');

    if (category) {
      controller.set('category', category.get('category'));
      controller.set('model', category.get('posts'));
    } else {
      this.transitionTo('catchall', 'category-not-found');
    }
  },

});
