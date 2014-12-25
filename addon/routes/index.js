import Em from 'ember';

export default Em.Route.extend({

  model: function() {
    return this.store.find('post');
  },

  setupController: function() {
    this.store.find('category');
    this._super(arguments);
  }
});
