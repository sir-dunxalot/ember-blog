'use strict';

module.exports = (function() {

  App.Router.map(function() {
    this.route('index', { path: '/' });
    this.route('about');
    this.resource('post', { path: '/post/:post_url' });
    this.resource('category', { path: '/category/:name' });
  });

  if (Modernizr.history) {
    App.Router.reopen({
      location: 'history'
    });
  } else {
    App.Router.reopen({
      location: 'hash'
    });
  }

}());
