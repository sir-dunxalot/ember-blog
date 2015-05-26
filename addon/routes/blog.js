import Ember from 'ember';

export default Ember.Route.extend({

  setupController: function(controller, model) {
    var authors = this.store.find('author');
    var categories = this.store.find('category');

    this._super(controller, model);

    controller.set('authors', authors);
    controller.set('categories', categories);
  },

});
