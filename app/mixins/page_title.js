'use strict';

App.PageTitle = Em.Mixin.create(
  App.Options, {

  pageTitle: null,

  setPageTitle: function() {
    var pageTitle = this.get('pageTitle');
    var controller = this.get('controller');
    var blogTitle = controller.get('blogTitle');

    // By default, set page title to blog title
    document.title = pageTitle ? pageTitle + ' | ' + blogTitle : blogTitle;
  }.observes('pageTitle').on('didInsertElement'),
});

Em.View.reopen(
  App.PageTitle, {

});
