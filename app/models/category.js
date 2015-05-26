import Category from 'ember-blog/models/category';
import fixtures from '../fixtures/categories'; // TODO

Category.reopenClass({
  FIXTURES: fixtures
});

export default Category;
