/*
Custom test for Firefox because it does not handle table height well
*/

Modernizr.addTest('firefox', function () {
 return !!navigator.userAgent.match(/firefox/i);
});

/**
Add a test to detect for background clip (used for text with color gradients)
*/

Modernizr.addTest('backgroundclip', function() {

  var div = document.createElement('div');

  if ('backgroundClip' in div.style) return true;

  'Webkit Moz O ms Khtml'.replace(/([A-Za-z]*)/g, function(val) {
    if (val + 'BackgroundClip' in div.style) return true;
  });

});
