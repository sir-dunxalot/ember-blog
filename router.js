export default function(router) {
  router.route('index', { path: '/' });
  router.route('about');
  router.resource('post', { path: '/post/:urlString' });
  router.resource('category', { path: '/category/:name' });
  router.route('catchall', {path: '/*wildcard'});
}
