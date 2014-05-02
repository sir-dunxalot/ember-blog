Octosmashed
==========

Most people have come accross an [Octopress](http://octopress.org/) blog whilst browsing the web. It's a great framework for coders who want to blog, but it has limitations. For example, development and post writing can be tedious when you need to refresh the page, you need to know ruby to write plugins, and github pages limits the capabilities of Jekyll. Enter Octosmashed.

Octosmashed is an Ember.js-based blogging framework built on Bruch. Features include:
- Pure JS stack (Node.js)
- Posts written in markdown (no database required)
- Live reloading and compiling
- Easy integration with npm modules and other JS plugins
- All [Twitter Bootstrap](http://getbootstrap.com/) CSS and JS capabilities
- Simple [CEM/BEM](http://www.smashingmagazine.com/2012/04/16/a-new-front-end-methodology-bem/)-based styling for interchangable layouts and themes written in CSS or SCSS with [Compass](http://compass-style.org/)

**Octosmashed works out-of-the-box but can be customized as much as you like. Writing your first post is as easy as starting the server!**

Prerequisites
------

- Node.js

Installation
------

1. [Install Node.js](http://nodejs.org/) if you don't have it installed already
2. Create a directory for the blog on your local machine and run `git init`
3. Copy the repo with `git clone git@github.com:sir-dunxalot/ember-blog.git`
4. Install the package with `npm install`
5. Start the app with `brunch watch -s` (the app will start at localhost:3333)

Usage
------

### Blog Posts

Write your blog posts in markdown with YAML front matter for post info. Octosmashed will automatically compile your posts and the categories you have used into Ember fixtures available to the rest of your blog. An example post:

```markdown
---
title: More Ember stuff
description: This is a description of the ember stuff in this article
published: 2014-02-29
author: Some Dude
categories:
 - ember
 - design
---

This is the blog content. I am writing this blog post all about Ember and stuff. This is a lot more content for markdown parsing.

**Some bold blog content**

```

Save the post in the `posts` directory with any filename you like (filename does not affect the fixtures compiling). Everything outside the YAML Front Matter will be [parsed as markdown](https://github.com/adam-p/markdown-here/wiki/Markdown-Cheatsheet#emphasis) and used for the content of the blog post.

Deployment & Github Pages
------

To compile your app for production (minimizing, optimizing, etc), run `brunch build --production`.

Deploying to [Github Pages](https://pages.github.com/) is super easy! Simply run `git push origin` or whatever command you use to push to the master branch of your blog repo. Octosmashed will run on Github Pages without any issues.

Todos & Known Issues
------

- WIP - lots of functionality needs to be added
- Automatically generate category fixtures
- Thorough documentation
- Page title updating
- application.html to hbs?
- github pages deployment task
- Social meta tags with handlebars unbound options
- Code/syntax highlighting
- Ember root as html, maybe
- Comment integration
- Social sharing
- Investigate benefits (if any) of using Ember.ListView with fixtures
- Social sharing
- Mobile testing
- Unit tests
- Test with large number of posts (300+)

Built on [brunch-with-ember-reloaded](https://github.com/gcollazo/brunch-with-ember-reloaded).

Questions & Comments
------

Hit me up at walkerdu@bc.edu
