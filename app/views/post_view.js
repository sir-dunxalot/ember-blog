App.PostView = Em.View.extend({
  classNames: ['post'],
  tagName: 'article',
  // layoutName: 'post',
  // templateName: 'test'

  pageTitle: function() {
    var controller = this.get('controller');
    var postTitle = controller.get('content.title');

    return postTitle;
  }.property('controller.content.title'),
});
