'use strict';

/* Dependencies */

var hljs = require('highlight.js');
var jsYaml = require('yaml-front-matter');
var marked = require('marked');

/* Private variables */

var authors = [];
var authorsFixtures = [];
var currentAuthorId = 0;

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

/* Method to add post and it's categories to fixtures */

exports.newPost = function newPost(content) {
  var customRenderer = new marked.Renderer();
  var post = jsYaml.loadFront(content);
  var author = post['author'];
  var authorIndex = authors.indexOf(author);
  var authorId;

  marked.setOptions({

    /* Highlight block code */

    highlight: function (code, lang) {

      if (lang) {
        code = hljs.highlight(lang, code).value;
      } else {
        code = hljs.highlightAuto(code).value;
      }

      /* Make sure Handlebars in block code isn't parsed by Ember */

      return replaceHandlebars(code);
    },
  });

  /* Make sure Handlebars in inline code isn't parsed by Ember  */

  customRenderer.codespan = function(text, level) {
    var codeBlock = replaceHandlebars(text);

    return '<code>' + codeBlock + '</code>';
  }

  /* Parse post content as markdown */

  post['__content'] = marked(post['__content'], {
    renderer: customRenderer
  });

  /* Makre sure Ember parses Handlebars correctly */

  post['__content'] = replaceApostrophes(post['__content']);

  /* Rename content to body */

  post['body'] = post['__content'];
  delete post['__content'];

  /* Add urlString to model */

  post['urlString'] = dasherize(post['title']);

  /* Map out the posts and authors belongsTo relationship */

  if (authorIndex === -1) {
    authors.push(author);

    authorsFixtures.push({
      id: currentAuthorId,
      name: author,
      posts: [currentPostId],
      urlString: dasherize(author)
    });

    authorId = currentAuthorId;
    currentAuthorId++;
  } else {
    authorId = authorIndex;
    author = authorsFixtures[authorId];

    author.posts.push(currentPostId);
  }

  post['author'] = authorId;

  /* Map out the posts and categories many-to-many relationship  */

  post['categories'] = post['categories'].map(function(category) {
    var categoryIndex = categories.indexOf(category);
    var category, categoryId;

    if (categoryIndex === -1) {

      /* Add categories that aren't already registered */

      categories.push(category);

      categoriesFixtures.push({
        id: currentCategoryId,
        name: category,
        posts: [currentPostId],
        urlString: dasherize(category)
      });

      categoryId = currentCategoryId;
      currentCategoryId++;
    } else {

      /* Add the post to already registered categories */

      categoryId = categoryIndex;
      category = categoriesFixtures[categoryId];

      category.posts.push(currentPostId);
    }

    return categoryId;
  });

  /* Add posts fixture ID */

  post['id'] = currentPostId;
  currentPostId++;

  return post;
}

/* Export other fixtures */

exports.authorsFixtures = authorsFixtures;
exports.categoriesFixtures = categoriesFixtures;
