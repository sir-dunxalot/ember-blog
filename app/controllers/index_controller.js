// TODO - array or object controller
App.IndexController = Em.ArrayController.extend({
  sortProperties: ['published:desc'],
  sortedPosts: Em.computed.sort('content', 'sortProperties'),
});
