/* Default options */

module.exports = {

  /* Setup- and architecture-based options */

  enabled: true,
  fileOptions: { encoding: 'utf8' },
  fixturesDir: 'fixtures',

  /* Titles */

  blogTitle: 'Octosmashed',
  blogAuthor: 'Your Name',

  /* Microformat classes */

  mf: {
    postFull: 'h-entry',
    postPreview: 'h-entry',
    postTitle: 'p-name',
    postDescription: 'p-summary',
    postPublishedDate: 'dt-published',
    postLink: 'u-url',
    postAuthor: 'p-author',
    postCategory: 'p-category',
    postContent: 'e-content'
  },
}
