import Em from 'ember';

export default Em.Handlebars.makeBoundHelper(function(string) {
  return string.capitalize();
});
