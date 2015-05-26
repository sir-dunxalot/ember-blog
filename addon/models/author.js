import DS from 'ember-data';

var attr = DS.attr;
var hasMany = DS.hasMany;

var Author = DS.Model.extend({
  name: attr('string'),
  posts: hasMany('post', { async: true }),
  urlString: attr('string')
});

export default Author;
