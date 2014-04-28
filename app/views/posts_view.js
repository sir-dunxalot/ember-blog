App.PostsView = Em.ListView.extend({
  classNames: ['posts'],
  height: 500,
  rowHeight: 50,
  itemsPerLoad: 10,
  itemViewClass: Em.ListItemView.extend({
    tagName: 'li',
    templateName: 'post_preview',
    classNames: ['post_preview'],
  }),
  tagName: 'ul',

  setSize: function() {
    var height = $(window).height();
    var itemsPerLoad = this.get('itemsPerLoad');
    var rowHeight = height / itemsPerLoad;

    this.set('height', height);
    this.set('rowHeight', rowHeight);
  }.on('didInsertElement'),
})
