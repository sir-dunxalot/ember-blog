import Em from 'ember';

/**
@class ApplicationController
@submodule controllers
*/

export default Em.ObjectController.extend({

  /**
  Set the current path and add it to the array of recently visited paths that is made available in all controllers.

  `navigation` is an alias made available to this controller by reopening `Em.ControllerMixin` in `controllers/navigation.js`.

  @method updateHistory
  */

  updateHistory: function() {
    var currentPath = this.get('currentPath');
    var navigation = this.get('navigation');

    navigation.set('currentPath', currentPath);

    if (currentPath !== 'loading') {
      navigation.pushObject(currentPath);

      // Limit length of navigation to last 'x' paths
      if (navigation.get('length') > navigation.get('maxLength')) {
        navigation.enumerableContentWillChange(1);
        navigation.get('content').shift();
        navigation.enumerableContentDidChange(1);
      }
    }

  }.observes('currentPath')

});
