import Em from 'ember';

export default Em.ObjectController.extend({
  sortProperties: ['published:desc'],
  sortedPosts: Em.computed.sort('posts', 'sortProperties'),
});
