import DS from 'ember-data';
import dasherize from 'octosmashed/utils/computed/dasherize';

var attr = DS.attr;
var hasMany = DS.hasMany;

var Category = DS.Model.extend({
  name: attr('string'),
  posts: hasMany('post', { async: true }),
  urlString: dasherize('name')
});

export default Category;
