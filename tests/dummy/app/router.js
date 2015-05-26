import Ember from 'ember';
import config from './config/environment';

var Router = Ember.Router.extend({
  location: config.locationType
});

Router.map(function() {

  this.route('blog', function() {

    this.route('authors');
    this.route('author', { path: '/authors/:urlString' });

    this.route('categories');
    this.route('category', { path: '/categories/:urlString' });

    this.route('posts');
    this.route('post', { path: '/posts/:urlString' });

  });

});

export default Router;
