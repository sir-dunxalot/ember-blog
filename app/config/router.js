'use strict';

module.exports = (function() {

  App.Router.map(function() {

    this.resource('post', { path: '/post/:post_url' });

  });

  if (Modernizr.history) {
    App.Router.reopen({
      location: 'history'
    });
  } else {
    App.Router.reopen({
      location: 'historyJs'
    });
  }

}());
