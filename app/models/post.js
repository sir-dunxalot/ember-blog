import Em from 'ember';
import Post from 'octosmashed/models/post';

var posts = Em.A();

// window.System = window.System || {};
// window.System['import'] = function(moduleName) {
//   return Em.RSVP.Promise.resolve(window.require(moduleName));
// }

/**
Find all available modules and grab the posts
*/

for (var module in window.require.entries) {
  var modulePath = module.toString();
  var indexOfPosts = modulePath.indexOf('posts/');

  if (indexOfPosts > -1) {
    // System.import(modulePath).then(function(module) {
      posts.pushObject(window.require(module)['default']);
    // });
  }
}

Post.reopenClass({
  FIXTURES: posts
});

export default Post;
