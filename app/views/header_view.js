App.HeaderView = Em.View.extend({
  ariaRole: 'banner',
  classNames: ['page_header'],
  isMobileNav: null,
  tagName: 'header',
  templateName: 'header',

  click: function() {
    var isMobileNav = this.get('isMobileNav');
    var list = this.$().find('ul:first');

    // If layout is in desktop nav mode, do nothing
    if (!isMobileNav) {
      return false;
    }

    list.slideToggle('fast');
  },

  // If the window is resized and goes from mobile layout to
  // desktop layout, always show nav
  showNav: function() {
    var isMobileNav = this.get('isMobileNav');

    if (!isMobileNav) {
      var list = this.$().find('ul:first');
      list.show();
    }
  }.observes('isMobileNav'),

  watchForResize: function() {
    var _this = this;

    $(window).resize(function() {
      _this._resized();
    });
  }.on('didInsertElement'),

  // When window is resized, check the layout type
  _resized: function() {
    var header = this.$();
    var displayCss = header.css('display');
    var isMobileNav = displayCss === 'table-header-group'; // Nav displaying above content

    this.set('isMobileNav', isMobileNav);
  },
});
