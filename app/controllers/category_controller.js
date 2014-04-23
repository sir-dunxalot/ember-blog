'use strict';

App.CategoryController = Em.ArrayController.extend({
  sortProperties: ['published:desc'],
  sortedPosts: Em.computed.sort('posts', 'sortProperties'),
});
