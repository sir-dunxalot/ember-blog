Em.Handlebars.helper('formatDate', function(date, format) {
  format = format.typeof === 'string' ? format : null;

  var formatString = format || 'MMM D[,] YYYY';
  var formattedDate = moment(date).format(formatString);
  return formattedDate;
});
