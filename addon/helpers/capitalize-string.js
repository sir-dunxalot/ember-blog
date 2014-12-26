import Em from 'ember';
import defaultFor from 'octosmashed/utils/default-for';

export default Em.Handlebars.makeBoundHelper(function(string) {
  string = defaultFor(string, '');

  return string.capitalize();
});
