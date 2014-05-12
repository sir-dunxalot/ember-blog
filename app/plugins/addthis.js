App.AddThisOptions = Em.Object.create({
  pubId: 'ra-537038fc122c939b',
  loaded: false,
});

App.AddThisComponent = Em.Component.extend({
  classNames: ['addthis_toolbox', 'addthis_default_style', 'addthis_32x32_style'],
  layout: Em.Handlebars.compile('<a class="addthis_button_preferred_1"></a><a class="addthis_button_preferred_2"></a><a class="addthis_button_preferred_3"></a><a class="addthis_button_preferred_4"></a><a class="addthis_button_compact"></a><a class="addthis_counter addthis_bubble_style"></a>'),

  loadAddThisApi: function() {
    var pubId = App.AddThisOptions.get('pubId');
    var url = '//s7.addthis.com/js/300/addthis_widget.js#async=1#domready=1';
    var controller = this.get('parentView.controller');

    var addThisConfig = {
      data_track_addressbar: true,
      pubid: pubId,
      ui_508_compliant: true
    };

    var addThisShare = {
      url: window.location.href,
      title: controller.get('title'),
      description: controller.get('description'),
    };

    window.addthis_config = addThisConfig;
    window.addthis_share = addThisShare;

    if (!App.AddThisOptions.get('loaded')) {
      Em.run.schedule('afterRender', function() {
        $.getScript(url).done(function() {
          console.log('done');
          // addthis.init();
          addthis.toolbox('.addthis_toolbox');
          App.AddThisOptions.set('loaded', true);
        });
      });
    } else {
      window.addthis_share = addThisShare;
      addthis.toolbox('.addthis_toolbox');
    }
  }.on('didInsertElement'),
});
