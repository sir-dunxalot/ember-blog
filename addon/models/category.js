import DS from 'ember-data';

var attr = DS.attr;
// var hasMany = DS.attr;

var Category = DS.Model.extend({
  name: attr('string'),
  // posts: hasMany('post'),
});

Category.reopenClass({
  FIXTURES: []
});

export default Category;
