import Em from 'ember';

/**
A controller to manage basic path caching so the current and previous path is available in any controller.

The functionality of this controller is heavily dependent on `App.ApplicationController.updateHistory()`.

@TODO - Make each breadcrumb an object with text and a link to the path
@TODO - Add advanced caching per path within this controller (if efficiency benefit is expected)

@class HistoryController
@submodule controllers
*/

export default Em.ArrayController.extend({

  /**
  The path of the route the router is currently in. For example `campaigns.campaign.show` or `businesses.index`.

  @property currentPath
  @type String
  */

  currentPath: null,

  /**
  The maximum number of most recently visited paths you want to cache.

  @property maxLength
  @type Number
  @default 5
  */

  maxLength: 5,

  /*
  The previous path the user was on. This is in the same format as `currentPath`.

  @property previousPath
  @type String
  */

  previousPath: null,

  /**
  An array of navigational breadcrumbs based on the current application path.

  @property breadcrumbs
  @type Array
  */

  breadcrumbs: function() {
    var pathParts = this.get('currentPath').split('.');
    var blacklist = ['index', 'show'];

    if (pathParts === ['index']) {
      pathParts = ['home'];
    }

    pathParts.forEach(function(part, i, arr) {
      var nextPart = arr[i + 1];
      var removePart = function() {
        pathParts.removeObject(part);
      };

      // Remove uninformational words from breadcrumbs
      if (blacklist.indexOf(part) > -1) {
        removePart();
      }

      // If route under plural resource (e.g. businesses.business) remove resource from breadcrumbs
      if (nextPart && part.indexOf(nextPart) > -1) {
        removePart();
      }
    });

    return pathParts;
  }.property('currentPath'),

  setPreviousPath: function() {
    this.set('previousPath', this.objectAt(this.get('length') - 2));
  }.observes('[]'),

});
