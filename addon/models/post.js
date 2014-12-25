import DS from 'ember-data';

var attr = DS.attr;
var hasMany = DS.hasMany;

var Post = DS.Model.extend({
  author: attr('string'),
  body: attr('string'),
  categories: hasMany('category', { async: true }),
  description: attr('string'),
  published: attr('string'),
  urlString: attr('string'),
  title: attr('string')
});

export default Post;
