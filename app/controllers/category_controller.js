App.CategoryController = Em.ArrayController.extend({
  // posts: [],
  // page: 1,
  // postsPerPage: 1,
  // itemController: 'post',

  // sortProperties: ['published'],
  // sortAscending: false,

  sortProperties: ['published:desc'],
  sortedPosts: Em.computed.sort('posts', 'sortProperties'),

  // paginatedContent: function() {
  //   var arrangedContent = this.get('arrangedContent');
  //   var result;
  //   console.log(arrangedContent);
  //   return result;
  // }.observes('arrangedContent.[]'),
});
