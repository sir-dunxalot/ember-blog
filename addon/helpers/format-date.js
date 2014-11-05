/* global moment */

import Em from 'ember';

export default Em.Handlebars.makeBoundHelper(function(date, format) {
  var formatString;

  format = format.typeof === 'string' ? format : null;
  formatString = format || 'MMM D, YYYY';

  return moment(date).format(formatString);
});
