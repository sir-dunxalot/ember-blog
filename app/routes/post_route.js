App.PostRoute = Em.Route.extend({

  // model: function(params) {
  //   return this.store.find('post', params.post_title);
  // },

  model: function(params) {
    // the server returns `{ slug: 'foo-post' }`
    // return this.store.find('post', params.post_url);

    return jQuery.getJSON('/post/' + params.post_url);
  },

  serialize: function(model) {
    // this will make the URL `/posts/foo-post`
    return { post_url: model.get('url') };
  },

});
