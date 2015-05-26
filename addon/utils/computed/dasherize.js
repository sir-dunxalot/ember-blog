import defaultFor from 'ember-blog/utils/default-for';
import Ember from 'ember';

export default function(dependentKey) {
  return function() {
    var property = defaultFor(this.get(dependentKey), '');

    return Ember.String.dasherize(property.toString());
  }.property(dependentKey);
}
