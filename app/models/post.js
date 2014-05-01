'use strict';

var attr = DS.attr;
var hasMany = DS.attr;

App.Post = DS.Model.extend({
  author: attr('string'),
  body: attr('string'),
  // categories: hasMany('category'),
  categories: attr(),
  description: attr('string'),
  published: attr('date'),
  urlString: attr('string'),
  title: attr('string'),
});
