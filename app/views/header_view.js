App.HeaderView = Em.View.extend({
  ariaRole: 'banner',
  classNames: ['page_header'],
  tagName: 'header',
  templateName: 'header',

  responsiveNav: function() {
    var navSelector = '.nav_list';
    // Delay init of responsive nav and hide original nav with css
    // so categories load and height is calculated correctly.
    // Then, show the nav in init() method
    Em.run.later(this, function() {
      var nav = responsiveNav(navSelector, { // Selector
        animate: true, // Boolean: Use CSS3 transitions, true or false
        transition: 284, // Integer: Speed of the transition, in milliseconds
        label: 'Nav', // String: Label for the navigation toggle
        insert: 'before', // String: Insert the toggle before or after the navigation
        // customToggle: "", // Selector: Specify the ID of a custom toggle
        closeOnNavClick: true, // Boolean: Close the navigation when one of the links are clicked
        openPos: "relative", // String: Position of the opened nav, relative or static
        navClass: "nav-collapse", // String: Default CSS class. If changed, you need to edit the CSS too!
        navActiveClass: "js-nav-active", // String: Class that is added to <html> element when nav is active
        init: function() { // Function: Init callback
          $(navSelector).css('display', 'block');
        },
      });
    }, 500);
  }.on('didInsertElement'),
});
