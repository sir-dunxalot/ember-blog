App.OctosmashedWatermarkComponent = Em.Component.extend({
  classNames: ['watermark'],
  layout: Em.Handlebars.compile('<a href="//github.com/sir-dunxalot/ember-blog" title="View the Octosmashed repo on Github" target="_blank"><img src="/images/octosmashed_watermark.png"></a>'),
});
