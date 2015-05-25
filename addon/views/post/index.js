import Ember from 'ember';

export default Ember.View.extend({
  classNames: ['post'],
  tagName: 'article',

  pageTitle: function() {
    var controller = this.get('controller');
    var postTitle = controller.get('model.title');

    return postTitle;
  }.property('controller.model.title'),
});
