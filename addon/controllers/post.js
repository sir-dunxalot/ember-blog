import Em from 'ember';

export default Em.ObjectController.extend({
  nfnf: function() {
    console.log(this.get('categories'));
  }.observes('categories')
});
