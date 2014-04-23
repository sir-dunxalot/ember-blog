var attr = DS.attr;
var hasMany = DS.attr;

App.Post = DS.Model.extend({
  title: attr('string'),
  published: attr('date'),
  categories: hasMany('category'),
  content: attr('string'),
});
