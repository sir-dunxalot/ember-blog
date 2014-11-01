/* global Modernizr */

import Em from 'ember';

var $ = Em.$;

export default Em.View.extend({
  ariaRole: 'application',
  classNames: ['app'],

  /*
  Firefox does not handle display: table; height well.
  Thus, we handle the height with jQuery to avoid adding
  unnecessary markup and css. IE can go fuck itself.
  */

  checkForFirefox: function() {
    var isFirefox = Modernizr.firefox;
    var windowHeight, contentWrapper;

    if (!isFirefox) {
      return false;
    }

    contentWrapper = $('.content_wrapper');

    $(window).resize(function() {
      windowHeight = $(window).height();
      contentWrapper.innerHeight(windowHeight);
    });

    $(window).resize(); // Call immediately on page load

  }.on('didInsertElement'),
});
