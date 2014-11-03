import Em from 'ember';

export default Em.Route.extend({

  model: function() {
    var posts = this.store.find('post');

    return posts;
  },
});
