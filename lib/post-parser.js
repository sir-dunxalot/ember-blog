'use strict';

/* Dependencies */

var hljs = require('highlight.js');
var jsYaml = require('yaml-front-matter');
var marked = require('marked');

/* Private variables */

var categories = [];
var categoriesFixtures = [];
var currentCategoryId = 0;
var currentPostId = 0;

/* Helper functions */

var dasherize = function(text) {
  return text.toLowerCase().replace(/\s+/g, '-').replace(/[^-a-z \d]/ig, '');
}

var replaceApostrophes = function(text) {
  return text.replace(/&#39;/g,'\u0027');
}

var replaceHandlebars = function(text) {
  return text.replace(/{{/g, '&#123;&#123;').replace(/}}/g, '&#125;&#125;');
}

exports.newPost = function newPost(content) {
  var customRenderer = new marked.Renderer();
  var post = jsYaml.loadFront(content);

  marked.setOptions({

    // Block code
    highlight: function (code, lang) {

      if (lang) {
        code = hljs.highlight(lang, code).value;
      } else {
        code = hljs.highlightAuto(code).value;
      }

      return replaceHandlebars(code);
    },
  });

  // Inline code
  customRenderer.codespan = function(text, level) {
    var codeBlock = replaceHandlebars(text);

    return '<code>' + codeBlock + '</code>';
  }

  /* Parse post content as markdown */

  post['__content'] = marked(post['__content'], {
    renderer: customRenderer
  });

  post['urlString'] = dasherize(post['title']);
  post['__content'] = replaceApostrophes(post['__content']);

  /* Rename content to body */

  post['body'] = post['__content'];
  delete post['__content'];

  post['categories'] = post['categories'].map(function(category) {
    var categoryId;

    if (categories.indexOf(category) === -1) {

      /* Add categories that aren't already registered */

      categories.push(category);

      categoriesFixtures.push({
        id: currentCategoryId,
        name: category,
        posts: [currentPostId]
      });

      categoryId = currentCategoryId;
      currentCategoryId++;
    } else {

      /* Add the post to already registered categories */

      categoryId = categories.indexOf(category);
      var category = categoriesFixtures[categoryId];

      category.posts.push(currentPostId);
    }

    return categoryId;
  });

  /* Add fixture ID */

  post['id'] = currentPostId;
  currentPostId++;

  return post;
}

exports.categoriesFixtures = categoriesFixtures;
