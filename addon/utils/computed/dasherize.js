import Em from 'ember';

export default function(dependentKey) {
  return function() {
    return this.get(dependentKey).dasherize();
  }.property(dependentKey);
}
