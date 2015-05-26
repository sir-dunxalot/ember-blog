import Author from 'ember-blog/models/author';
import fixtures from '../fixtures/authors'; // TODO

Author.reopenClass({
  FIXTURES: fixtures
});

export default Author;
