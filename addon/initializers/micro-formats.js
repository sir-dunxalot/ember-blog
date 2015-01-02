export default {
  name: 'microFormats',

  initialize: function(container, app) {

    /* Defaults */

    var microFormats = {
      postFull: 'h-entry',
      postPreview: 'h-entry',
      postTitle: 'p-name',
      postDescription: 'p-summary',
      postPublishedDate: 'dt-published',
      postLink: 'u-url',
      postAuthor: 'p-author',
      postCategory: 'p-category',
      postContent: 'e-content'
    };

    /* Override defaults */

    for (var option in app.mf) {
      microFormats[option] = app.mf[option];
    }

    app.register('microFormats:main', microFormats, { instantiate: false });
    app.inject('controller', 'mf', 'microFormats:main');
  }
};
