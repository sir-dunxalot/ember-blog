'use strict';

var attr = DS.attr;
var hasMany = DS.attr;

App.Category = DS.Model.extend({
  name: attr('string'),
  // posts: hasMany('post'),
});
