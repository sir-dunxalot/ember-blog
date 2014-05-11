'use strict';

/**
Add your info here to link this blog to your free Disqus account
*/

App.DisqusOptions = Em.Object.create({
  shortname: 'jebbittech',
});

/**
Load Disqus when the blog loads (and only load it once)
*/

App.ApplicationView.reopen({
  setupDisqus: function() {
    var disqusShortname = App.DisqusOptions.get('shortname');

    /* * * DON'T EDIT BELOW THIS LINE * * */
    var dsq = document.createElement('script'); dsq.type = 'text/javascript'; dsq.async = true;
    dsq.src = '//' + disqusShortname + '.disqus.com/embed.js';
    (document.getElementsByTagName('head')[0] || document.getElementsByTagName('body')[0]).appendChild(dsq);

  }.on('didInsertElement'),
});

/**
View to show comments for the related blog post and/or page
*/

App.DisqusView = Em.View.extend({
  elementId: 'disqus_thread',
  classNames: ['comments'],
  timer: null,

  loadNewPostComments: function() {
    if (window.DISQUS) {
      this.reset();
    } else {
      this.set('timer', Em.run.debounce(this, this.loadNewPostComments, 100));
    }
  }.on('willInsertElement'),

  reset: function() {
    var controller = this.get('controller');
    var postIdentifier = controller.get('urlString');
    var postUrl = controller.get('router.url');

    console.log('resetting');

    window.DISQUS.reset({
      reload: true,
      config: function () {
        this.page.identifier = postIdentifier;
        this.page.url = postUrl;
      }
    });
  }
});

/**
Load Disqus comment count to add to each post preview
*/

App.DisqusCommentCount = Em.Mixin.create({
  getCommentCounts: function() {
    var disqusShortname = App.DisqusOptions.get('shortname');

    /* * * DON'T EDIT BELOW THIS LINE * * */
    var s = document.createElement('script'); s.async = true;
    s.type = 'text/javascript';
    s.src = '//' + disqusShortname + '.disqus.com/count.js';
    (document.getElementsByTagName('HEAD')[0] || document.getElementsByTagName('BODY')[0]).appendChild(s);
  }.on('didInsertElement'),
});

App.PostsView.reopen(
  App.DisqusCommentCount, {

});

Em.LinkView.reopen({
  addDisqusTag: function() {
    var href = this.get('href');
    var disqusTag = '#disqus_thread';
    var isLinkToPost = href.indexOf('post/') > -1;

    if (isLinkToPost) {
      this.set('href', href + disqusTag);
    }
  }.on('willInsertElement'),
});

// <a href="http://disqus.com" class="dsq-brlink">comments powered by <span class="logo-disqus">Disqus</span></a>
