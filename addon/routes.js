export default function(context) {
  context.route('blog', function() {

    this.route('authors');
    this.route('author', { path: '/authors/:urlString' });

    this.route('categories');
    this.route('category', { path: '/categories/:urlString' });

    this.route('posts');
    this.route('post', { path: '/posts/:urlString' });

  });
}
