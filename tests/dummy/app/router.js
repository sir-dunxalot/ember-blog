import Ember from 'ember';
import config from './config/environment';

var Router = Ember.Router.extend({
  location: config.locationType
});

Router.map(function() {

  this.route('blog', function() {

    this.route('posts', function() {
      this.route('post', { path: '/:urlString' });
    });

    this.resource('categories', function() {
      this.route('category', { path: '/:urlString' });
    });
  });

});

export default Router;
