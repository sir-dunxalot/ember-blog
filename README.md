# Ember Blog

Adds a blog to any Ember CLI application.

- Write your posts in markdown and HTMLBars
- Add post metadata using YAML front matter

This addon compiles posts and associated categories into fixtures, adds new routes to your application for rendering that data (e.g. posts, categories, etc), and provides additional blog infrastructure.

## Installation

```
ember install ember-blog
```

## Usage

Documentation coming soon. **This is early stage, currently under testing**. In the meantime, see the `tests/dummy` app for example usage.

Posts are written in the following format and are saved at `app-name/posts/any-old-name.js`. The file name does not affect the blog post in any way.

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

{{#link-to 'about'}}This is a HTMLBars link{{/link-to}}

```
