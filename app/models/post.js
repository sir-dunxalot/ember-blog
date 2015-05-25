import Post from 'ember-blog/models/post';
import fixtures from 'dummy/fixtures/posts'; // TODO

Post.reopenClass({
  FIXTURES: fixtures
});

export default Post;
