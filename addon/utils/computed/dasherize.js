import defaultFor from 'octosmashed/utils/default-for';

export default function(dependentKey) {
  return function() {
    var property = defaultFor(this.get(dependentKey), '');

    return property.toString().dasherize();
  }.property(dependentKey);
}
