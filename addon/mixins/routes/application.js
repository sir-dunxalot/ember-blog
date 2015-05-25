import Ember from 'ember';

export default Ember.Mixin.create({

  setupController: function(controller) {
    var categories = this.store.find('category');

    this._super(arguments);
    controller.set('blogCategories', categories);
  },

})
