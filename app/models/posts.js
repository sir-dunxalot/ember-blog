// var post = require('posts/welcome-to-ember');

// post['id'] = 1;

App.ApplicationAdapter = DS.FixtureAdapter.extend();

var attr = DS.attr;
var hasMany = DS.attr;

// App.Category = DS.Model.extend({
//   post: hasMany('post'),
// });

App.Post = DS.Model.extend({
  title: attr('string'),
  pusblished: attr('date'),
  // categories: hasMany('category'),
  categories: attr(),
  __content: attr('atring'),
});

// App.Post.FIXTURES = [];


