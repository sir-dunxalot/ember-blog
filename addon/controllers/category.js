import Ember from 'ember';

export default Ember.ArrayController.extend({ // TODO
  sortProperties: ['published:desc'],
  sortedPosts: Ember.computed.sort('content', 'sortProperties'),
});
