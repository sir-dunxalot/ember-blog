import Ember from 'ember';

export default Ember.Controller.extend(
  Ember.SortableMixin, {

  sortProperties: ['published:desc'],
  sortedPosts: Ember.computed.sort('model', 'sortProperties'),
});
