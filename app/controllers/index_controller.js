'use strict';

App.IndexController = Em.ArrayController.extend({
  sortProperties: ['published:desc'],
  sortedPosts: Em.computed.sort('content', 'sortProperties'),
});
