import Ember from 'ember';
import defaultFor from 'ember-blog/utils/default-for';

export function capitalizeString(params) {
  var string = defaultFor(params[0], '');

  return Ember.String.capitalize(string);
}

export default Ember.HTMLBars.makeBoundHelper(capitalizeString);
