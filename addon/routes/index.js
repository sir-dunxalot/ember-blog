import Em from 'ember';

export default Em.Route.extend({

  model: function() {
    var posts = this.store.all('post');

    return posts;
  },
});
