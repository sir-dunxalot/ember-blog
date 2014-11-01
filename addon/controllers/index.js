import Em from 'ember';

export default Em.ArrayController.extend({
  sortProperties: ['published:desc'],
  sortedPosts: Em.computed.sort('content', 'sortProperties'),
});
