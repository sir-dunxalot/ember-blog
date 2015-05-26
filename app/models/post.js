import Post from 'ember-blog/models/post';
import fixtures from '../fixtures/posts';

Post.reopenClass({
  FIXTURES: fixtures
});

export default Post;
