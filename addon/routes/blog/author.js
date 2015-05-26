import Ember from 'ember';

export default Ember.Route.extend({

  model: function(params) {
    return this.store.find('author', { urlString: params.urlString });
  },

  setupController: function(controller, model) {
    var author = model.get('content.firstObject');

    controller.setProperties({
      author: author.get('author'),
      model: author.get('posts')
    });
  },

});
