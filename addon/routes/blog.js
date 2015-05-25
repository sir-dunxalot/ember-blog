import Ember from 'ember';

export default Ember.Route.extend({

  setupController: function(controller) {
    var categories = this.store.find('category');

    this._super(arguments);
    controller.set('blogCategories', categories);
  },

});
