App.DisqusView = Em.View.extend({
  elementId: 'disqus_thread',

  setupDisqus: function() {
    /* * * CONFIGURATION VARIABLES: EDIT BEFORE PASTING INTO YOUR WEBPAGE * * */
    var disqus_shortname = this.get('controller.disqus.shortname'); // required: replace example with your forum shortname

    /* * * DON'T EDIT BELOW THIS LINE * * */
    (function() {
      var dsq = document.createElement('script'); dsq.type = 'text/javascript'; dsq.async = true;
      dsq.src = '//' + disqus_shortname + '.disqus.com/embed.js';
      (document.getElementsByTagName('head')[0] || document.getElementsByTagName('body')[0]).appendChild(dsq);
    })();

    // this.reset();
  }.on('didInsertElement'),

  reset: function() {
    DISQUS.reset({
      reload: true,
      config: function () {
        this.page.identifier = "newidentifier";
        this.page.url = "http://example.com/#!newthread";
      }
    });
  },
});
