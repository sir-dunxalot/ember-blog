import Em from 'ember';
import defaultFor from 'octosmashed/utils/default-for';

export default Em.Handlebars.makeBoundHelper(function(string) {
  // console.log(string);
  string = defaultFor(string, '');
  // string = string.toString();

  return string.capitalize();
});
