import Ember from 'ember';

export default Ember.CollectionView.extend({
  classNames: ['posts'],
  tagName: 'ol',

  itemViewClass: Ember.View.extend({
    tagName: 'li',
    templateName: 'posts/preview',
    classNames: ['post-preview'],
  }),

});
