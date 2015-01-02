/* global responsiveNav, Modernizr */

import Em from 'ember';

export default Em.View.extend({
  ariaRole: 'banner',
  classNames: ['page_header'],
  tagName: 'header',
  templateName: 'header',

  responsiveNav: function() {
    var navSelector = '.nav_list';

    responsiveNav(navSelector, {
      animate: (Modernizr.csstransitions && Modernizr.cssanimations),
      transition: 250,
      // label: '<a class="button nav_toggle">Nav</a>', // String: Label for the navigation toggle
      label: '<button class="nav_toggle_button"><span class="hidden">Nav</span></button>', // String: Label for the navigation toggle
      insert: 'before', // String: Insert the toggle before or after the navigation
      closeOnNavClick: true,
      openPos: 'relative', // relative or static
      navClass: 'nav-collapse', // String: Default CSS class. If changed, you need to edit the CSS too!
      navActiveClass: 'js-nav-active', // String: Class that is added to <html> element when nav is active
      init: function() {
        Em.$(navSelector).css('display', 'block');
      },
    });
  }.on('didInsertElement'),
});
