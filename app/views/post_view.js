App.PostView = Em.View.extend({
  classNames: ['post'],
  tagName: 'article',

  pageTitle: function() {
    var controller = this.get('controller');
    var postTitle = controller.get('content.title');

    return postTitle;
  }.property('controller.content.title')
});
