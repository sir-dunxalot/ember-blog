import Post from 'octosmashed/models/post';

// import test1 from '../posts/test';
import test1 from '../posts/leak-attack/1';
import test2 from '../posts/leak-attack/2';
import test3 from '../posts/leak-attack/3';

Post.reopenClass({
  FIXTURES: [test1, test2, test3]
});

export default Post;
