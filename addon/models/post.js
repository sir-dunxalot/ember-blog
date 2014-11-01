import DS from 'ember-data';

var attr = DS.attr;
// var hasMany = DS.attr;

var Post = DS.Model.extend({
  author: attr('string'),
  // categories: hasMany('category'),
  categories: attr(),
  description: attr('string'),
  published: attr('string'),
  urlString: attr('string'),
  title: attr('string'),
});

Post.reopenClass({
  FIXTURES: []
});

export default Post;
