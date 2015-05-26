import Ember from 'ember';

export default Ember.Route.extend({

  setupController: function(controller, model) {
    var categories = this.store.find('category');

    this._super(controller, model);
    controller.set('categories', categories);
  },

});
