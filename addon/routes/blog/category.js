import Ember from 'ember';

export default Ember.Route.extend({

  model: function(params) {
    return this.store.find('category', { urlString: params.urlString });
  },

  setupController: function(controller, model) {
    var category = model.get('content.firstObject');

    controller.setProperties({
      category: category.get('category'),
      model: category.get('posts')
    });
  },

});
