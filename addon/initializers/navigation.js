import Em from 'ember';

export default {
  name: 'navigation',

  initialize: function() {
    Em.ControllerMixin.reopen({

      needs: ['navigation'],
      navigation: Em.computed.alias('controllers.navigation'),

    });
  }
};
