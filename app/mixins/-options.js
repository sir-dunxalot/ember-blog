'use strict';

App.Options = Em.Mixin.create({
  // Basic settings
  blogTitle: 'Octosmashed',
  blogAuthor: 'Duncan Walker',

  // Social

  // Misc
  googleAnalyticsCode: 'xouxou',

  // Microformat classes
  mf: {
    postFull: 'h-entry',
    postPreview: 'h-entry',
    postTitle: 'p-name',
    postDescription: 'p-summary',
    postPublishedDate: 'dt-published',
    postLink: 'u-url',
  }
});
