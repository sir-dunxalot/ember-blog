---
title: More Ember stuff
description: This is a description of the ember stuff in this article
published: 2014-02-29
author: Michael Dane
categories:
 - ember
 - design
---

This is a lot more `content` for markdown parsing

**Ok yeah**

```ruby
App.PostView = Em.View.extend({
  classNames: ['post'],
  tagName: 'article',

  pageTitle: function() {
    var controller = this.get('controller');
    var postTitle = controller.get('content.title');

    return postTitle;
  }.property('controller.content.title'),
});
```
