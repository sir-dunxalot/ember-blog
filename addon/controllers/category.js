import Em from 'ember';

export default Em.ObjectController.extend({
  sortProperties: ['published:desc'],
  sortedPosts: Em.computed.sort('posts', 'sortProperties'),

  // jfbf: function() {
  //   console.log(this.get('content'));
  // }.observes('content')
});
