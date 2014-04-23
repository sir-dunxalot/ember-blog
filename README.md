ember-blog
==========

WIP Ember.js-based blogging framework built on Bruch. Think Octopress (yaml front matter, markdown, etc) on a modern stack.

Built on [brunch-with-ember-reloaded](https://github.com/gcollazo/brunch-with-ember-reloaded).

Installation
------

1. Copy the repo with `git clone git@github.com:sir-dunxalot/ember-blog.git`
2. Add your categories to `fixtures/categories.js`
3. Run `brunch watch -s` to live preview your blog
4. Run `brunch build --production` to build minified source the the public directory

Usage
------

### Blog Posts

Write blog post as markdown with YAML front matter for post info:

```markdown
---
title: More Ember stuff
description: This is a description of the ember stuff in this article
published: 2014-02-29
categories:
 - ember
 - design
---

This is the blog content. This is a lot more content for markdown parsing.

**Some bold blog content**

```

Save the post in the `posts` directory with any filename you like (filename does not affect the app in anyway). Brunch will turn the post into Ember fixtures and everything outside the YAML Front Matter will be [parsed as markdown](https://github.com/adam-p/markdown-here/wiki/Markdown-Cheatsheet#emphasis) and used for the content of the blog post.

Aim is to make the framework unopinionated with regards to deployment, etc, whilst incorporating easy build tasks o github pages, etc.

Todos and Known Issues
------

- WIP - lots of functionality needs adding
- Automatically generate category fixtures
- Thorough documentation
- Basic CSS
