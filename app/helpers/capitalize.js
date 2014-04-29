Em.Handlebars.helper('capitalize', function(string) {
  var capitalizedString = string.charAt(0).toUpperCase() + string.slice(1);
  return capitalizedString;
});
