import Author from 'ember-blog/models/author';
import fixtures from 'dummy/fixtures/authors'; // TODO

Author.reopenClass({
  FIXTURES: fixtures
});

export default Author;
