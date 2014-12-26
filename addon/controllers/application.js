import Em from 'ember';

/**
@class ApplicationController
@submodule controllers
*/

export default Em.ObjectController.extend({

  /**
  Set the current path and add it to the array of recently visited paths that is made available in all controllers.

  `history` is an alias made available to this controller by reopening `Em.ControllerMixin` in `controllers/history.js`.

  @method updateHistory
  */

  updateHistory: function() {
    var currentPath = this.get('currentPath');
    var history = this.get('history');

    history.set('currentPath', currentPath);

    if (currentPath !== 'loading') {
      history.pushObject(currentPath);

      // Limit length of history to last 'x' paths
      if (history.get('length') > history.get('maxLength')) {
        history.enumerableContentWillChange(1);
        history.get('content').shift();
        history.enumerableContentDidChange(1);
      }
    }

  }.observes('currentPath')

});
