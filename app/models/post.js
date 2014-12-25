import Post from 'octosmashed/models/post';
import fixtures from 'fixtures/posts';

Post.reopenClass({
  FIXTURES: fixtures
});

export default Post;
