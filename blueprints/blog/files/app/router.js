import Ember from 'ember';
import config from './config/environment';

var Router = Ember.Router.extend({
  location: config.locationType
});

Router.map(function() {
  // this.route('index', { path: '/' });
  // this.route('about');
  // this.resource('post', { path: '/post/:urlString' });
  // this.resource('category', { path: '/category/:urlString' });
  // this.route('catchall', {path: '/*wildcard'});
});

export default Router;
