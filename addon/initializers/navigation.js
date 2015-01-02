import Em from 'ember';

export default {
  name: 'navigation',

  initialize: function(/* container, app */) {
    Em.ControllerMixin.reopen({

      needs: ['navigation'],
      navigation: Em.computed.alias('controllers.navigation'),

    });
  }
};
