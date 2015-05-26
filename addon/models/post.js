import DS from 'ember-data';

var attr = DS.attr;
var belongsTo = DS.belongsTo;
var hasMany = DS.hasMany;

var Post = DS.Model.extend({
  author: belongsTo('author', { async: true }),
  body: attr('string'),
  categories: hasMany('category', { async: true }),
  description: attr('string'),
  published: attr('string'),
  title: attr('string'),
  urlString: attr('string')
});

export default Post;
