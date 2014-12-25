import Category from 'octosmashed/models/category';
import fixtures from 'fixtures/categories';

Category.reopenClass({
  FIXTURES: fixtures
});

export default Category;
