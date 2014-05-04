App.ApplicationRoute = Ember.Route.extend({
  actions: {
    // Errors bubble up to application route
    error: function () {
      this.transitionTo('catchall', 'page-not-found');
    }
  }
});
