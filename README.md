![Octosmashed Logo](http://jebbit.github.io/images/octosmashed_logo.png)

Octosmashed
==========

Octosmashed is a JavaScript MVC-based static blogging tool based on the idea of [Octopress](http://octopress.org/). Octopress is a great framework for coders who want to blog, but it has limitations. For example, development and post writing can be tedious when you need to refresh the page, you need to know ruby to write plugins, and github pages limits the capabilities of Jekyll. Enter Octosmashed.

*** <strong><a href="http://jebbit.github.io/" target="_blank">Live Demo</a></strong> ***

Octosmashed is an Ember.js-based blogging framework built on Bruch. Features include:
- Pure JS stack ([Node.js](http://nodejs.org/) server with [Brunch](http://brunch.io/) build tools)
- Write your posts in markdown (no database required)
- Single-command deploy to Github pages
- Live blog reloading and compiling
- Easy integration with npm modules and other JS plugins
- All [Twitter Bootstrap](http://getbootstrap.com/) CSS and JS capabilities
- Interchangable layouts and themes written in SCSS with [Compass](http://compass-style.org/)
- [Microformatting](http://microformats.org/wiki/microformats2#h-entry) and [ARIA](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA) integration (WIP)

**Octosmashed works out-of-the-box but can be customized as much as you like. Writing your first post is as easy as starting the server!**

Prerequisites
------

- [Install Node.js](http://nodejs.org/)

Installation
------

1. Check prerequisites
2. Copy the repo with `git clone git@github.com:sir-dunxalot/ember-blog.git`
3. Install the packages with `npm install --save`
4. Start the app with `brunch watch -s` (the app will start at localhost:3333)

For advanced setup and customizatoin, including tips for deploying to Github Pages, see the [getting started docs](//github.com/sir-dunxalot/ember-blog/blob/master/documentation/getting_started.md).

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

Deploying to [Github Pages](https://pages.github.com/) is super easy! Octosmashed will run on Github Pages without any issues. Just run the command 'jake deploy'. This is equivalent to running:

```
brunch build --production
git add .
git commit -m "Built for deployment on Month Date Year, Time"
git push origin master
```

Documentation
------

- [Getting Started](//github.com/sir-dunxalot/ember-blog/blob/master/documentation/getting_started.md)
- [Writing Posts](//github.com/sir-dunxalot/ember-blog/blob/master/documentation/writing_posts.md)
- [Deployment](//github.com/sir-dunxalot/ember-blog/blob/master/documentation/deployment.md)
- [Vendors & Third-party Integration](//github.com/sir-dunxalot/ember-blog/blob/master/documentation/vendors.md)

**Customizing**

- [Layout](//github.com/sir-dunxalot/ember-blog/blob/master/documentation/layout.md)
- [Theme](//github.com/sir-dunxalot/ember-blog/blob/master/documentation/theme.md)


Todos & Known Issues
------

- WIP - lots of functionality needs to be added
- Thorough documentation
- application.html to hbs?
- Social meta tags with handlebars unbound options
- Ember root as html, maybe
- Investigate benefits (if any) of using Ember.ListView with fixtures
- Mobile testing
- Unit tests
- Test with large number of posts (300+)
- SEO capabilities (phantomJS)
- Parse CSS for unused rules
- Allow ember components to be used in template (Em.Handlebars.compile(post.body);
- Do special characters in title used in URL break the app?
- Quick classes for layout (e.g. image on left)
- Facebook sharing URL
- Add block and inline-block %placeholders
- Code overflow should scroll or option to expand full screen, maybe on hover?

Built on [brunch-with-ember-reloaded](https://github.com/gcollazo/brunch-with-ember-reloaded).

Questions & Comments
------

Hit me up at walkerdu@bc.edu
