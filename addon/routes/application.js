import Em from 'ember';

export default Em.Route.extend({

  actions: {
    // Errors bubble up to application route
    error: function () {
      this.transitionTo('catchall', 'error');
    },
  },

  setupController: function(controller /*, model */) {
    var categories = this.store.find('category');

    this._super(arguments);
    controller.set('navigation.categories', categories);
  }

});
