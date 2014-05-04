App.HeaderView = Em.View.extend({
  ariaRole: 'banner',
  classNames: ['page_header'],
  hasMobileNav: false,
  tagName: 'header',
  templateName: 'header',

  click: function() {
    var hasMobileNav = this.get('hasMobileNav');
    var list;

    // If layout is in desktop nav mode, do nothing
    if (!hasMobileNav) {
      return false;
    }

    list = this.$().find('ul:first');
    list.slideToggle('fast');
  },

  // If the window is resized and goes from mobile layout to
  // desktop layout, always show nav
  showNav: function() {
    var hasMobileNav = this.get('hasMobileNav');
    var list;

    if (!hasMobileNav) {
      list = this.$().find('ul:first');
      list.show();
    }
  }.observes('hasMobileNav'),

  watchForResize: function() {
    var _this = this;

    // Run mobile nav check on load
    _this._resized();

    $(window).resize(function() {
      _this._resized();
    });
  }.on('didInsertElement'),

  // When window is resized, check the layout type
  _resized: function() {
    var header = this.$();
    var displayCss = header.css('display');
    var hasMobileNav = displayCss === 'table-header-group'; // Nav displaying above content

    this.set('hasMobileNav', hasMobileNav);
  },
});
