var attr = DS.attr;
var hasMany = DS.attr;

App.Category = DS.Model.extend({
  name: attr('string'),
  posts: hasMany('post'),
});

App.Category.FIXTURES = [
  {
    id: 1,
    name: 'Ember',
  },{
    id: 2,
    name: 'Rails',
  },
  {
    id: 3,
    name: 'Design',
  },
  {
    id: 4,
    name: 'Lifestyle',
  },
];
