Writing Posts
======

Posts are written in [Markdown](https://github.com/adam-p/markdown-here/wiki/Markdown-Cheatsheet) with [YAML Front matter](http://jekyllrb.com/docs/frontmatter/) used to contain post metadata (e.g. title, description, published date, etc).

osts should be saved in the `app/posts` directory. The filename does **not** affect the blog post in anyway. Organize the posts how you wish.

A sample post file might look like this:

```markdown
---
title: A Post About Ember.js
description: Learn all about the features and capabilities of Ember.js
published: 2014-05-29
author: Marty Mcfly
categories:
 - ember
 - design
---

Ember.js is a self-proclaimed "framework for creating ambitious web applications." It allows you to write less code, waste less time, and makes developers productive out-of-the-box.

Ember.js uses:
- jQuery
- Handlebars

**Here is some bold content**

More blog post content...

```

Post Metadata
------

Out-of-the-box, Octosmashed has support for to following post attributes:

**Title** (String)

`title` is the title of your blog post. A dasherized version of the title will be used for the post's URL. For example a post with `title: My blog title` can be found at `localhost:3333/post/my-blog-title`

**Description** (String)

`description` is the description of the post used to preview the post to the user.

**Published** (Date)

`published` is the publication date attributed to the blog post. It should be in the format YYYY-MM-DD.

**Author** (String)

`author` is the name of the blog post's author.

**Categories** (Array)

`categories` is a list of the categories the post is organized into. A post can have zero, one, or more categories but they should always be formatted in a list. For example:

```
categories:
 - ember
 - rails
```

The categories added to each post will automatically be compiled by Brunch and will represent to core of your blog's navigation. It is reccomended to only use a few categories throughout your blog. Do not use `categories` for tagging posts.
