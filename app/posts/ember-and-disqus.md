---
title: Ember and Disqus
description: Using Disqus, the commenting system, with Ember.js requires Disqus to run asyncronously. This post will walk you through the steps you need to take to add the free commenting system to your Ember app.
published: 2014-05-18
author: Jebbit
categories:
 - ember
---

<a href="//gist.github.com/sir-dunxalot/e3cdcf2fd427cbe40a47" target="_blank">
  <i class="icon-github"></i>
  <span class="text">See the full code snippet here</span>
</a>

To successfully integrate <a href="//disqus.com/" target="_blank">Disqus</a> within your Ember app, you will need to run Disqus asyncronously.

You can use an Ember Object to hold the Disqus options, if you like:

```javascript
App.DisqusOptions = Em.Object.create({
  shortname: 'your-account-shortname', // Change this
});
```

Using an `Em.Component` for the Disqus comments will allows us to easily place the comments block on each page or post using a handlebars helper. For example, `{{disqus-comments}}`. However, the main challenge we face is asyncronously loading the comments as the user changes routes so each page shows only the comments related to it.

First, let's set up our component:

```javascript
App.DisqusCommentsComponent = Em.Component.extend({
  elementId: 'disqus_thread',
  classNames: ['comments'],
});
```

The ID `#disqus_thread` is required so the Disqus API we load knows to render the comments wherever we place this component in our templates.

Now, let's load the Disqus API script. We fire the loading method on the `didInsertElement` event so the loaded script can target the component's `elementId`, once the component has been rendered on the page. This method could, alternatively, be called in `App.ApplicationView`.

`disqus_title` is a javascript configuration variable used by Disqus when creating the thread for each of your pages. In this situation, we are using a property on the route's controller called `title` to identify and keep track of the threads in our Disqus admin panel. By default, Disqus will use the window URL, so you can leave this out, if you wish.

```javascript
App.DisqusCommentsComponent = Em.Component.create({
  // ... Previous Code...

  setupDisqus: function() {
    var controller = this.get('parentView.controller');
    var title = controller.get('title');

    window.disqus_title = title;

    if (!window.DISQUS) {
      var disqusShortname = App.DisqusOptions.get('shortname');

      window.disqus_shortname = disqusShortname;

      /* Loading code provided by Disqus */
      var dsq = document.createElement('script'); dsq.type = 'text/javascript'; dsq.async = true;
      dsq.src = '//' + disqusShortname + '.disqus.com/embed.js';
      (document.getElementsByTagName('head')[0] || document.getElementsByTagName('body')[0]).appendChild(dsq);
    }
  }.on('didInsertElement'),
});
```

Now we are successfully loading the Disqus API but we need to implement Disqus' prebuilt `DISQUS.reset()` method to asynchrously load the correct posts when the user changes route. However, we cannot call this method if the Disqus API has not finished loading yet. So, we check to see if Disqus has loaded (i.e. the `DISQUS` object is present). If Disqus hasn't finished loading then we use the Ember run loop's `debounce` method to check again in 100ms:

```javascript
App.DisqusCommentsComponent = Em.Component.create({
  // ... Previous code...
  timer: null, // New property to 'hold' the debounce

  loadNewPostComments: function() {
    if (window.DISQUS) {
      this.reset();
    } else {
      this.set('timer', Em.run.debounce(this, this.loadNewPostComments, 100));
    }
  }.on('willInsertElement'),
});
```

We need to provide Disqus' reset method with two arguements, `identifier` and `url`. In this case, the identifier is a property on the controller that is unique to each page.

Finally, when we call Disqus' `reset()` method we need to call it at the correct time... `DISQUS.reset()` looks for the `#disqus_thread` ID so we need to call it after the component has finished rendering (similar to running the API loading function on `didInsertElement`). We do this by, again, utilizing the Ember run loop and running `DISQUS.reset()` on the `afterRender` hook, as follows:

```javascript
App.DisqusCommentsComponent = Em.Component.create({
  // ...Previous code...

  reset: function() {
    var controller = this.get('parentView.controller');
    var postIdentifier = controller.get('urlString');
    var postUrl = window.location.href;

    Em.run.scheduleOnce('afterRender', function() {
      window.DISQUS.reset({
        reload: true,
        config: function () {
          this.page.identifier = postIdentifier;
          this.page.url = postUrl;
        }
      });
    });
  },
});
```

And there you have it! Simply place the `{{disqus-comments}}` in the template of each page or post and Disqus will load the comments for that page. Just remember, to set up your Disqus shortname and `DISQUS.reset()` config paramaters.

For a working example, look no further than the bottom of this page! You can leave a comment and see it update instantly and then go to another post and watch the new comments load.

<a href="//gist.github.com/sir-dunxalot/e3cdcf2fd427cbe40a47" target="_blank">
  <i class="icon-github"></i>
  <span class="text">See the full code snippet here</span>
</a>

Disqus has a Comment Count capability, which I'll be covering in a future post.

---

Further Reading
------

- [Disqus configuration variables](http://help.disqus.com/customer/portal/articles/472098-javascript-configuration-variables)
- [Using Disqus on AJAX sites](http://help.disqus.com/customer/portal/articles/472107-using-disqus-on-ajax-sites)
- [Disqus reset example](https://github.com/disqus/DISQUS-API-Recipes/blob/master/snippets/js/disqus-reset/disqus_reset.html)
