import Em from 'ember';

export default {
  name: 'history',

  initialize: function() {
    Em.ControllerMixin.reopen({

      needs: ['history'],

      /**
      An alias to the history controller, made acessible in all controllers.

      An example use case:

      ```
      App.SomeController = Em.ObjectController.extend({

        someCheck: function() {
          if (this.get('history.previousPath') === 'campaign.edit') {
            // Do something
          }
        }

      });
      ```
      */

      history: Em.computed.alias('controllers.history'),

      /**
      By default, every route will be behind an authentication
      wall. A user whose authentication fails will be brought to
      the sign-in route. Any route that is not should have the following property:
      ```
      authRedirectable: false
      ```
       */

    });
  }
};
