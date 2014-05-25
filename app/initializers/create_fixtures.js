'use strict';

Em.Application.initializer({
  name: 'postsFixtures',

  initialize: function(container, application) {
    var allCategories = [];

    // Load each post and add it to the fixtures with post model
    window.require.list().filter(function(module) {
      return new RegExp('^posts/').test(module);
    }).forEach(function(module) {
      var store = container.lookup('store:main');
      var post = require(module);
      var title = post.title;
      var categories = post.categories;
      var published, newPost, newCat;

      categories.forEach(function(cat) {
        // If category has not already been added to fixtures...
        if (allCategories.indexOf(cat) == -1) {
          allCategories.push(cat);

          newCat = store.createRecord('category', { name: cat });
          newCat.save();
        }
      });

      // Add string to model for link-to helpers and url serialization
      post['urlString'] = title.dasherize();

      // Hacks to allow handlebars compiling of blog post body and print handlebars inside code blocks
      // TODO - This is probably slow as hell. Need a better way to do this, and do it pre-deployment.
      post['__content'] = post['__content'].replace(/&#39;/g,'\u0027');
      post['__content'] = post['__content'].replace(/<code(?:\s+[^>]+)*>(?:.*?{{.+?}})*.*<\/code>/g, function(a) {
        return(a.replace(/{{/g, "&#123;&#123;").replace(/}}/g, "&#125;&#125;"));
      });

      // Write blog post body to a partial
      Em.TEMPLATES['_' + post['urlString']] = Em.Handlebars.compile(post['__content']);
      delete post['__content'];

      // Convert JS date to Date object for Ember model DS.attr('date')
      post['publishedObject'] = new Date(post['published']);

      newPost = store.createRecord('post', post);
      newPost.save();
    });
  },
})
