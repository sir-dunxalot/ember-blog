(function(/*! Brunch !*/) {
  'use strict';

  var globals = typeof window !== 'undefined' ? window : global;
  if (typeof globals.require === 'function') return;

  var modules = {};
  var cache = {};

  var has = function(object, name) {
    return ({}).hasOwnProperty.call(object, name);
  };

  var expand = function(root, name) {
    var results = [], parts, part;
    if (/^\.\.?(\/|$)/.test(name)) {
      parts = [root, name].join('/').split('/');
    } else {
      parts = name.split('/');
    }
    for (var i = 0, length = parts.length; i < length; i++) {
      part = parts[i];
      if (part === '..') {
        results.pop();
      } else if (part !== '.' && part !== '') {
        results.push(part);
      }
    }
    return results.join('/');
  };

  var dirname = function(path) {
    return path.split('/').slice(0, -1).join('/');
  };

  var localRequire = function(path) {
    return function(name) {
      var dir = dirname(path);
      var absolute = expand(dir, name);
      return globals.require(absolute, path);
    };
  };

  var initModule = function(name, definition) {
    var module = {id: name, exports: {}};
    cache[name] = module;
    definition(module.exports, localRequire(name), module);
    return module.exports;
  };

  var require = function(name, loaderPath) {
    var path = expand(name, '.');
    if (loaderPath == null) loaderPath = '/';

    if (has(cache, path)) return cache[path].exports;
    if (has(modules, path)) return initModule(path, modules[path]);

    var dirIndex = expand(path, './index');
    if (has(cache, dirIndex)) return cache[dirIndex].exports;
    if (has(modules, dirIndex)) return initModule(dirIndex, modules[dirIndex]);

    throw new Error('Cannot find module "' + name + '" from '+ '"' + loaderPath + '"');
  };

  var define = function(bundle, fn) {
    if (typeof bundle === 'object') {
      for (var key in bundle) {
        if (has(bundle, key)) {
          modules[key] = bundle[key];
        }
      }
    } else {
      modules[bundle] = fn;
    }
  };

  var list = function() {
    var result = [];
    for (var item in modules) {
      if (has(modules, item)) {
        result.push(item);
      }
    }
    return result;
  };

  globals.require = require;
  globals.require.define = define;
  globals.require.register = define;
  globals.require.list = list;
  globals.require.brunch = true;
})();
require.register("config/app", function(exports, require, module) {
'use strict';

var config = {
    LOG_TRANSITIONS: true,
    LOG_TRANSITIONS_INTERNAL: false
};

module.exports = Ember.Application.create(config);

});

;require.register("config/env", function(exports, require, module) {
'use strict';

module.exports = (function() {
  var envObject = {};
  var moduleNames = window.require.list().filter(function(module) {
    return new RegExp('^envs/').test(module);
  });

  moduleNames.forEach(function(module) {
    var key = module.split('/').reverse()[0];
    envObject[key] = require(module);
  });

  return envObject;
}());

});

;require.register("config/router", function(exports, require, module) {
'use strict';

module.exports = (function() {

  App.Router.map(function() {
    this.route('index', { path: '/' });
    this.route('about');
    this.resource('post', { path: '/post/:post_url' });
    this.resource('category', { path: '/category/:category_name' });
  });

  if (Modernizr.history) {
    App.Router.reopen({
      location: 'history'
    });
  } else {
    App.Router.reopen({
      location: 'hash'
    });
  }

}());

});

;require.register("config/store", function(exports, require, module) {
'use strict';

module.exports = (function() {

  App.ApplicationStore = DS.Store.extend({
    revision: 13
  });

  App.ApplicationAdapter = DS.FixtureAdapter.extend();

}());

});

;require.register("controllers/application_controller", function(exports, require, module) {
'use strict';

App.ApplicationController = Em.ObjectController.extend({

});

});

;require.register("controllers/category_controller", function(exports, require, module) {
'use strict';

App.CategoryController = Em.ArrayController.extend({
  sortProperties: ['published:desc'],
  sortedPosts: Em.computed.sort('posts', 'sortProperties'),
});

});

;require.register("controllers/index_controller", function(exports, require, module) {
'use strict';

App.IndexController = Em.ArrayController.extend({
  sortProperties: ['published:desc'],
  sortedPosts: Em.computed.sort('content', 'sortProperties'),
});

});

;require.register("fixtures/categories", function(exports, require, module) {
'use strict';

App.Category.FIXTURES = [
  {
    id: 1,
    name: 'Ember',
  },{
    id: 2,
    name: 'Rails',
  },
  {
    id: 3,
    name: 'Design',
  },
  {
    id: 4,
    name: 'Lifestyle',
  }
];

});

;require.register("fixtures/posts", function(exports, require, module) {
App.Post.FIXTURES = [];

});

;require.register("helpers/format_date", function(exports, require, module) {
Em.Handlebars.helper('formatDate', function(date, format) {
  format = format.typeof === 'string' ? format : null;

  var formatString = format || 'MMM D[,] YYYY';
  var formattedDate = moment(date).format(formatString);
  return formattedDate;
});

});

;require.register("initialize", function(exports, require, module) {
'use strict';

window.App = require('config/app');
require('config/router');
require('config/store');

// Load all modules in order automagically. Ember likes things to work this
// way so everything is in the App.* namespace.
var folderOrder = [
    'initializers', 'models', 'fixtures',
    'mixins', 'routes', 'views', 'controllers',
    'helpers', 'templates', 'components'
];

folderOrder.forEach(function(folder) {
  window.require.list().filter(function(module) {
    return new RegExp('^' + folder + '/').test(module);
  }).forEach(function(module) {
    require(module);
  });
});

});

;require.register("initializers/posts_fixtures", function(exports, require, module) {
'use strict';

Em.Application.initializer({
  name: 'postsFixtures',

  initialize: function(container, application) {
    var postIndex = 1;

    // Load each post and add it to the fixtures with post model
    window.require.list().filter(function(module) {
      return new RegExp('^posts/').test(module);
    }).forEach(function(module) {
      var post = require(module);

      // Add index to object (required for Ember fixtures)
      post['id'] = postIndex;

      // Rename content for model (can't start with an underscore and content is reserved)
      post['body'] = post['__content'];
      delete post['__content'];

      container.lookup('store:main').createRecord('post', post);

      postIndex++;
    });
  },
})

});

;require.register("mixins/-options", function(exports, require, module) {
'use strict';

App.Options = Em.Mixin.create({
  // Basic settings
  blogTitle: 'Octosmashed',
  blogAuthor: 'Duncan Walker',

  // Social

  // Misc
  googleAnalyticsCode: 'xouxou',
});

});

;require.register("mixins/categories", function(exports, require, module) {
'use strict';

App.Categories = Em.Mixin.create({
  categories: function() {
    var store = this.get('store');
    var categories = store.find('category');

    return categories;
  }.property(),
});

});

;require.register("mixins/controller_mixin", function(exports, require, module) {
'use strict';

Em.ControllerMixin.reopen(
  App.Categories,
  App.Options, {

});

});

;require.register("models/category", function(exports, require, module) {
'use strict';

var attr = DS.attr;
var hasMany = DS.attr;

App.Category = DS.Model.extend({
  name: attr('string'),
  // posts: hasMany('post'),
});

});

;require.register("models/posts", function(exports, require, module) {
var attr = DS.attr;
var hasMany = DS.attr;

App.Post = DS.Model.extend({
  title: attr('string'),
  published: attr('date'),
  categories: hasMany('category'),
  content: attr('string'),
});

});

;require.register("posts/welcome-to-ember", function(exports, require, module) {
module.exports = {"title":"More Ember stuff","description":"This is a description of the ember stuff in this article","published":"2014-03-01T00:00:00.000Z","categories":["ember","design"],"__content":"<p>This is a lot more content for markdown parsing</p>\n<p><strong>Ok yeah</strong></p>\n"}
});

;require.register("posts/welcome-to-your-ember-blog", function(exports, require, module) {
module.exports = {"title":"Welcome to Your Ember Blog","description":"How to do stuff with your Ember blog","published":"2014-03-30T00:00:00.000Z","categories":["ember","lifestyle"],"__content":"<p>Loads of text for this amazing blog post! os sos ssousus souduof ufuofouffuoouf ufu uofuofuof uf ofou fo</p>\n<p>You now have</p>\n<ul>\n<li>Jekyll</li>\n<li>Html5 Boilerplate based templates</li>\n<li>jQuery and Modernizr</li>\n<li>Sass and Compass</li>\n<li>rdiscount markdown parser and Pygments highlighter</li>\n</ul>\n<p>installed.</p>\n<p><strong>Enjoy coding!</strong></p>\n<p>Loads of text for this amazing blog post!</p>\n<p>You now have</p>\n<ul>\n<li>Jekyll</li>\n<li>Html5 Boilerplate based templates</li>\n<li>jQuery and Modernizr</li>\n<li>Sass and Compass</li>\n<li>rdiscount markdown parser and Pygments highlighter</li>\n</ul>\n<p>installed.</p>\n<p><strong>Enjoy coding!</strong></p>\n<p>Loads of text for this amazing blog post!</p>\n<p>You now have</p>\n<ul>\n<li>Jekyll</li>\n<li>Html5 Boilerplate based templates</li>\n<li>jQuery and Modernizr</li>\n<li>Sass and Compass</li>\n<li>rdiscount markdown parser and Pygments highlighter</li>\n</ul>\n<p>installed.</p>\n<p><strong>Enjoy coding!</strong></p>\n"}
});

;require.register("routes/category_route", function(exports, require, module) {
'use strict';

App.CategoryRoute = Ember.Route.extend({
  posts: [],

  // Category data
  model: function(params) {
    var category = this.store.find('category', params.category_name);
    return category;
  },

  // Posts data
  afterModel: function(params) {
    var _this = this;

    return this.store.filter('post', function(post) {
      var categories = post.get('categories');
      var pageCategory = params.get('name').toLowerCase();

      return categories.indexOf(pageCategory) > -1;
    }).then(function(result) {
      _this.set('posts', result.content);
    });
  },

  // URL
  serialize: function(model) {
    var obj = { category_name: model.get('name').dasherize() };
    return obj;
  },

  setupController: function() {
    var posts = this.get('posts');
    this.controller.set('posts', posts);
  },

});

});

;require.register("routes/index_route", function(exports, require, module) {
'use strict';

App.IndexRoute = Ember.Route.extend({

  model: function() {
    var posts = this.store.all('post');
    return posts;
  },
});

});

;require.register("routes/post_route", function(exports, require, module) {
'use strict';

App.PostRoute = Em.Route.extend({

  model: function(params) {
    var post = this.store.find('post', params.post_url);
    return post;
  },

  // URL
  serialize: function(model) {
    var obj = { post_url: model.get('title').dasherize() };
    return obj;
  },

});

});

;require.register("templates/about", function(exports, require, module) {
module.exports = Ember.TEMPLATES['about'] = Ember.Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Ember.Handlebars.helpers); data = data || {};
  


  data.buffer.push("test\n");
  
});
});

;require.register("templates/application", function(exports, require, module) {
module.exports = Ember.TEMPLATES['application'] = Ember.Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Ember.Handlebars.helpers); data = data || {};
  var buffer = '', stack1, helper, options, helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression;


  data.buffer.push(escapeExpression((helper = helpers.partial || (depth0 && depth0.partial),options={hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["STRING"],data:data},helper ? helper.call(depth0, "partials/header", options) : helperMissing.call(depth0, "partial", "partials/header", options))));
  data.buffer.push("\n\n<main class=\"main\" role=\"main\">\n  <div class=\"content_wrapper\">\n    <div class=\"content\">\n      ");
  stack1 = helpers._triageMustache.call(depth0, "outlet", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push("\n      ");
  data.buffer.push(escapeExpression((helper = helpers.partial || (depth0 && depth0.partial),options={hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["STRING"],data:data},helper ? helper.call(depth0, "partials/footer", options) : helperMissing.call(depth0, "partial", "partials/footer", options))));
  data.buffer.push("\n    </div>\n  </div>\n</main>\n\n<!-- Google Analytics: change UA-XXXXX-X to be your site's ID. -->\n<script>\n  (function(b,o,i,l,e,r){b.GoogleAnalyticsObject=l;b[l]||(b[l]=\n  function(){(b[l].q=b[l].q||[]).push(arguments)});b[l].l=+new Date;\n  e=o.createElement(i);r=o.getElementsByTagName(i)[0];\n  e.src='//www.google-analytics.com/analytics.js';\n  r.parentNode.insertBefore(e,r)}(window,document,'script','ga'));\n  ga('create','");
  data.buffer.push(escapeExpression(helpers.unbound.call(depth0, "googleAnalyticsCode", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data})));
  data.buffer.push("');ga('send','pageview');\n</script>\n");
  return buffer;
  
});
});

;require.register("templates/category", function(exports, require, module) {
module.exports = Ember.TEMPLATES['category'] = Ember.Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Ember.Handlebars.helpers); data = data || {};
  var buffer = '', stack1, helper, options, escapeExpression=this.escapeExpression, helperMissing=helpers.helperMissing;


  data.buffer.push(escapeExpression(helpers.log.call(depth0, "content", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data})));
  data.buffer.push("\n\n<h1>");
  stack1 = helpers._triageMustache.call(depth0, "name", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push("</h1>\n\n");
  data.buffer.push(escapeExpression((helper = helpers.collection || (depth0 && depth0.collection),options={hash:{
    'content': ("sortedPosts")
  },hashTypes:{'content': "ID"},hashContexts:{'content': depth0},contexts:[depth0],types:["ID"],data:data},helper ? helper.call(depth0, "App.PostsView", options) : helperMissing.call(depth0, "collection", "App.PostsView", options))));
  data.buffer.push("\n");
  return buffer;
  
});
});

;require.register("templates/index", function(exports, require, module) {
module.exports = Ember.TEMPLATES['index'] = Ember.Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Ember.Handlebars.helpers); data = data || {};
  var buffer = '', helper, options, helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression;


  data.buffer.push("<h1>Latest Posts</h1>\n\n");
  data.buffer.push(escapeExpression((helper = helpers.collection || (depth0 && depth0.collection),options={hash:{
    'content': ("sortedPosts")
  },hashTypes:{'content': "ID"},hashContexts:{'content': depth0},contexts:[depth0],types:["ID"],data:data},helper ? helper.call(depth0, "App.PostsView", options) : helperMissing.call(depth0, "collection", "App.PostsView", options))));
  data.buffer.push("\n");
  return buffer;
  
});
});

;require.register("templates/partials/_footer", function(exports, require, module) {
module.exports = Ember.TEMPLATES['partials/_footer'] = Ember.Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Ember.Handlebars.helpers); data = data || {};
  


  data.buffer.push("<div class=\"footer\" role=\"contentinfo\">\n  Footer\n</div>\n");
  
});
});

;require.register("templates/partials/_header", function(exports, require, module) {
module.exports = Ember.TEMPLATES['partials/_header'] = Ember.Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Ember.Handlebars.helpers); data = data || {};
  var buffer = '', helper, options, helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression;


  data.buffer.push("<header class=\"header\" role=\"banner\">\n  ");
  data.buffer.push(escapeExpression((helper = helpers.partial || (depth0 && depth0.partial),options={hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["STRING"],data:data},helper ? helper.call(depth0, "partials/navigation", options) : helperMissing.call(depth0, "partial", "partials/navigation", options))));
  data.buffer.push("\n</header>\n");
  return buffer;
  
});
});

;require.register("templates/partials/_navigation", function(exports, require, module) {
module.exports = Ember.TEMPLATES['partials/_navigation'] = Ember.Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Ember.Handlebars.helpers); data = data || {};
  var buffer = '', stack1, helper, options, self=this, helperMissing=helpers.helperMissing;

function program1(depth0,data) {
  
  
  data.buffer.push("Home");
  }

function program3(depth0,data) {
  
  
  data.buffer.push("About");
  }

function program5(depth0,data) {
  
  var buffer = '', stack1, helper, options;
  data.buffer.push("\n      <li>\n        ");
  stack1 = (helper = helpers['link-to'] || (depth0 && depth0['link-to']),options={hash:{},hashTypes:{},hashContexts:{},inverse:self.noop,fn:self.program(6, program6, data),contexts:[depth0,depth0],types:["STRING","ID"],data:data},helper ? helper.call(depth0, "category", "", options) : helperMissing.call(depth0, "link-to", "category", "", options));
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push("\n      </li>\n    ");
  return buffer;
  }
function program6(depth0,data) {
  
  var buffer = '', stack1;
  data.buffer.push("\n          ");
  stack1 = helpers._triageMustache.call(depth0, "name", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push("\n        ");
  return buffer;
  }

  data.buffer.push("<nav class=\"nav\" role=\"navigation\">\n  <ul class=\"nav_list\">\n    <li>");
  stack1 = (helper = helpers['link-to'] || (depth0 && depth0['link-to']),options={hash:{},hashTypes:{},hashContexts:{},inverse:self.noop,fn:self.program(1, program1, data),contexts:[depth0],types:["STRING"],data:data},helper ? helper.call(depth0, "index", options) : helperMissing.call(depth0, "link-to", "index", options));
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push("</li>\n    <li>");
  stack1 = (helper = helpers['link-to'] || (depth0 && depth0['link-to']),options={hash:{},hashTypes:{},hashContexts:{},inverse:self.noop,fn:self.program(3, program3, data),contexts:[depth0],types:["STRING"],data:data},helper ? helper.call(depth0, "about", options) : helperMissing.call(depth0, "link-to", "about", options));
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push("</li>\n    ");
  stack1 = helpers.each.call(depth0, "categories", {hash:{},hashTypes:{},hashContexts:{},inverse:self.noop,fn:self.program(5, program5, data),contexts:[depth0],types:["ID"],data:data});
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push("\n  </ul>\n</nav>\n");
  return buffer;
  
});
});

;require.register("templates/post", function(exports, require, module) {
module.exports = Ember.TEMPLATES['post'] = Ember.Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Ember.Handlebars.helpers); data = data || {};
  var buffer = '', stack1, escapeExpression=this.escapeExpression;


  data.buffer.push("<h1>");
  stack1 = helpers._triageMustache.call(depth0, "title", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push("</h1>\n");
  data.buffer.push(escapeExpression(helpers._triageMustache.call(depth0, "body", {hash:{
    'unescaped': ("true")
  },hashTypes:{'unescaped': "STRING"},hashContexts:{'unescaped': depth0},contexts:[depth0],types:["ID"],data:data})));
  data.buffer.push("\n");
  return buffer;
  
});
});

;require.register("templates/post_preview", function(exports, require, module) {
module.exports = Ember.TEMPLATES['post_preview'] = Ember.Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Ember.Handlebars.helpers); data = data || {};
  var buffer = '', stack1, helper, options, self=this, helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression;

function program1(depth0,data) {
  
  var stack1;
  stack1 = helpers._triageMustache.call(depth0, "title", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  else { data.buffer.push(''); }
  }

  data.buffer.push("<h2>\n  ");
  stack1 = (helper = helpers['link-to'] || (depth0 && depth0['link-to']),options={hash:{},hashTypes:{},hashContexts:{},inverse:self.noop,fn:self.program(1, program1, data),contexts:[depth0,depth0],types:["STRING","ID"],data:data},helper ? helper.call(depth0, "post", "", options) : helperMissing.call(depth0, "link-to", "post", "", options));
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push("\n</h2>\n\n<p class=\"alt_text\">");
  data.buffer.push(escapeExpression((helper = helpers.formatDate || (depth0 && depth0.formatDate),options={hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data},helper ? helper.call(depth0, "published", options) : helperMissing.call(depth0, "formatDate", "published", options))));
  data.buffer.push("</p>\n\n<p>");
  stack1 = helpers._triageMustache.call(depth0, "description", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push("</p>\n");
  return buffer;
  
});
});

;require.register("views/application_view", function(exports, require, module) {
App.ApplicationView = Em.View.extend({
  ariaRole: 'application',
  classNames: ['page'],
});

});

;require.register("views/ember_list_view", function(exports, require, module) {
// Last commit: 37baf55 (2014-02-10 20:49:20 -0500)


// ==========================================================================
// Project:   Ember ListView
// Copyright: Â©2012-2013 Erik Bryn, Yapp Inc., and contributors.
// License:   Licensed under MIT license
// ==========================================================================


(function() {
var get = Ember.get, set = Ember.set;

function samePosition(a, b) {
  return a && b && a.x === b.x && a.y === b.y;
}

function positionElement() {
  var element, position, _position;

  Ember.instrument('view.updateContext.positionElement', this, function() {
    element = get(this, 'element');
    position = this.position;
    _position = this._position;

    if (!position || !element) { return; }

    // TODO: avoid needing this by avoiding unnecessary
    // calls to this method in the first place
    if (samePosition(position, _position)) { return; }
    Ember.run.schedule('render', this, this._parentView.applyTransform, element, position.x, position.y);
    this._position = position;
  }, this);
}

Ember.ListItemViewMixin = Ember.Mixin.create({
  init: function(){
    this._super();
    this.one('didInsertElement', positionElement);
  },
  classNames: ['ember-list-item-view'],
  _position: null,
  updatePosition: function(position) {
    this.position = position;
    this._positionElement();
  },
  _positionElement: positionElement
});

})();



(function() {
var get = Ember.get, set = Ember.set;

var backportedInnerString = function(buffer) {
  var content = [], childBuffers = buffer.childBuffers;

  Ember.ArrayPolyfills.forEach.call(childBuffers, function(buffer) {
    var stringy = typeof buffer === 'string';
    if (stringy) {
      content.push(buffer);
    } else {
      buffer.array(content);
    }
  });

  return content.join('');
};

function willInsertElementIfNeeded(view) {
  if (view.willInsertElement) {
    view.willInsertElement();
  }
}

function didInsertElementIfNeeded(view) {
  if (view.didInsertElement) {
    view.didInsertElement();
  }
}

function rerender() {
  var element, buffer, context, hasChildViews;
  element = get(this, 'element');

  if (!element) { return; }

  context = get(this, 'context');

  // releases action helpers in contents
  // this means though that the ListViewItem itself can't use classBindings or attributeBindings
  // need support for rerender contents in ember
  this.triggerRecursively('willClearRender');

  if (this.lengthAfterRender > this.lengthBeforeRender) {
    this.clearRenderedChildren();
    this._childViews.length = this.lengthBeforeRender; // triage bug in ember
  }

  if (context) {
    buffer = Ember.RenderBuffer();
    buffer = this.renderToBuffer(buffer);

    // check again for childViews, since rendering may have added some
    hasChildViews = this._childViews.length > 0;

    if (hasChildViews) {
      this.invokeRecursively(willInsertElementIfNeeded, false);
    }

    element.innerHTML = buffer.innerString ? buffer.innerString() : backportedInnerString(buffer);

    set(this, 'element', element);

    this.transitionTo('inDOM');

    if (hasChildViews) {
      this.invokeRecursively(didInsertElementIfNeeded, false);
    }
  } else {
    element.innerHTML = ''; // when there is no context, this view should be completely empty
  }
}

/**
  The `Ember.ListViewItem` view class renders a
  [div](https://developer.mozilla.org/en/HTML/Element/div) HTML element
  with `ember-list-item-view` class. It allows you to specify a custom item
  handlebars template for `Ember.ListView`.

  Example:

  ```handlebars
  <script type="text/x-handlebars" data-template-name="row_item">
    {{name}}
  </script>
  ```

  ```javascript
  App.ListView = Ember.ListView.extend({
    height: 500,
    rowHeight: 20,
    itemViewClass: Ember.ListItemView.extend({templateName: "row_item"})
  });
  ```

  @extends Ember.View
  @class ListItemView
  @namespace Ember
*/
Ember.ListItemView = Ember.View.extend(Ember.ListItemViewMixin, {
  updateContext: function(newContext){
    var context = get(this, 'context');
    Ember.instrument('view.updateContext.render', this, function() {
      if (context !== newContext) {
        set(this, 'context', newContext);
        if (newContext && newContext.isController) {
          set(this, 'controller', newContext);
        }
      }
    }, this);
  },
  rerender: function () { Ember.run.scheduleOnce('render', this, rerender); },
  _contextDidChange: Ember.observer(rerender, 'context', 'controller')
});

})();



(function() {
var get = Ember.get, set = Ember.set;

Ember.ReusableListItemView = Ember.View.extend(Ember.ListItemViewMixin, {
  init: function(){
    this._super();
    this.set('context', Ember.ObjectProxy.create());
  },
  isVisible: Ember.computed('context.content', function(){
    return !!this.get('context.content');
  }),
  updateContext: function(newContext){
    var context = get(this, 'context.content');
    if (context !== newContext) {
      if (this.state === 'inDOM') {
        this.prepareForReuse(newContext);
      }

      set(this, 'context.content', newContext);

      if (newContext && newContext.isController) {
        set(this, 'controller', newContext);
      }
    }
  },
  prepareForReuse: Ember.K
});

})();



(function() {
var el = document.createElement('div'), style = el.style;

var propPrefixes = ['Webkit', 'Moz', 'O', 'ms'];

function testProp(prop) {
  if (prop in style) return prop;
  var uppercaseProp = prop.charAt(0).toUpperCase() + prop.slice(1);
  for (var i=0; i<propPrefixes.length; i++) {
    var prefixedProp = propPrefixes[i] + uppercaseProp;
    if (prefixedProp in style) {
      return prefixedProp;
    }
  }
  return null;
}

var transformProp = testProp('transform');
var perspectiveProp = testProp('perspective');

var supports2D = transformProp !== null;
var supports3D = perspectiveProp !== null;

Ember.ListViewHelper = {
  transformProp: transformProp,
  applyTransform: (function(){
    if (supports2D) {
      return function(element, x, y){
        element.style[transformProp] = 'translate(' + x + 'px, ' + y + 'px)';
      };
    } else {
      return function(element, x, y){
        element.style.top  = y + 'px';
        element.style.left = x + 'px';
      };
    }
  })(),
  apply3DTransform: (function(){
    if (supports3D) {
      return function(element, x, y){
        element.style[transformProp] = 'translate3d(' + x + 'px, ' + y + 'px, 0)';
      };
    } else if (supports2D) {
      return function(element, x, y){
        element.style[transformProp] = 'translate(' + x + 'px, ' + y + 'px)';
      };
    } else {
      return function(element, x, y){
        element.style.top  = y + 'px';
        element.style.left = x + 'px';
      };
    }
  })()
};

})();



(function() {
var get = Ember.get, set = Ember.set,
min = Math.min, max = Math.max, floor = Math.floor,
ceil = Math.ceil,
forEach = Ember.ArrayPolyfills.forEach;

function addContentArrayObserver() {
  var content = get(this, 'content');
  if (content) {
    content.addArrayObserver(this);
  }
}

function removeAndDestroy(object){
  this.removeObject(object);
  object.destroy();
}

function syncChildViews(){
  Ember.run.once(this, '_syncChildViews');
}

function sortByContentIndex (viewOne, viewTwo){
  return get(viewOne, 'contentIndex') - get(viewTwo, 'contentIndex');
}

function notifyMutationListeners() {
  if (Ember.View.notifyMutationListeners) {
    Ember.run.once(Ember.View, 'notifyMutationListeners');
  }
}

var domManager = Ember.create(Ember.ContainerView.proto().domManager);

domManager.prepend = function(view, html) {
  view.$('.ember-list-container').prepend(html);
  notifyMutationListeners();
};

function syncListContainerWidth(){
  var elementWidth, columnCount, containerWidth, element;

  elementWidth = get(this, 'elementWidth');
  columnCount = get(this, 'columnCount');
  containerWidth = elementWidth * columnCount;
  element = this.$('.ember-list-container');

  if (containerWidth && element) {
    element.css('width', containerWidth);
  }
}

function enableProfilingOutput() {
  function before(name, time, payload) {
    console.time(name);
  }

  function after (name, time, payload) {
    console.timeEnd(name);
  }

  if (Ember.ENABLE_PROFILING) {
    Ember.subscribe('view._scrollContentTo', {
      before: before,
      after: after
    });
    Ember.subscribe('view.updateContext', {
      before: before,
      after: after
    });
  }
}

/**
  @class Ember.ListViewMixin
  @namespace Ember
*/
Ember.ListViewMixin = Ember.Mixin.create({
  itemViewClass: Ember.ReusableListItemView,
  emptyViewClass: Ember.View,
  classNames: ['ember-list-view'],
  attributeBindings: ['style'],
  domManager: domManager,
  scrollTop: 0,
  bottomPadding: 0,
  _lastEndingIndex: 0,
  paddingCount: 1,

  /**
    @private

    Setup a mixin.
    - adding observer to content array
    - creating child views based on height and length of the content array

    @method init
  */
  init: function() {
    this._super();
    this.on('didInsertElement', syncListContainerWidth);
    this.columnCountDidChange();
    this._syncChildViews();
    this._addContentArrayObserver();
  },

  _addContentArrayObserver: Ember.beforeObserver(function() {
    addContentArrayObserver.call(this);
  }, 'content'),

  /**
    Called on your view when it should push strings of HTML into a
    `Ember.RenderBuffer`.

    Adds a [div](https://developer.mozilla.org/en-US/docs/HTML/Element/div)
    with a required `ember-list-container` class.

    @method render
    @param {Ember.RenderBuffer} buffer The render buffer
  */
  render: function(buffer) {
    buffer.push('<div class="ember-list-container">');
    this._super(buffer);
    buffer.push('</div>');
  },

  willInsertElement: function() {
    if (!this.get("height") || !this.get("rowHeight")) {
      throw new Error("A ListView must be created with a height and a rowHeight.");
    }
    this._super();
  },

  /**
    @private

    Sets inline styles of the view:
    - height
    - width
    - position
    - overflow
    - -webkit-overflow
    - overflow-scrolling

    Called while attributes binding.

    @property {Ember.ComputedProperty} style
  */
  style: Ember.computed('height', 'width', function() {
    var height, width, style, css;

    height = get(this, 'height');
    width = get(this, 'width');
    css = get(this, 'css');

    style = '';

    if (height) { style += 'height:' + height + 'px;'; }
    if (width)  { style += 'width:'  + width  + 'px;'; }

    for ( var rule in css ){
      if (css.hasOwnProperty(rule)) {
        style += rule + ':' + css[rule] + ';';
      }
    }

    return style;
  }),

  /**
    @private

    Performs visual scrolling. Is overridden in Ember.ListView.

    @method scrollTo
  */
  scrollTo: function(y) {
    throw new Error('must override to perform the visual scroll and effectively delegate to _scrollContentTo');
  },

  /**
    @private

    Internal method used to force scroll position

    @method scrollTo
  */
  _scrollTo: Ember.K,

  /**
    @private
    @method _scrollContentTo
  */
  _scrollContentTo: function(y) {
    var startingIndex, endingIndex,
        contentIndex, visibleEndingIndex, maxContentIndex,
        contentIndexEnd, contentLength, scrollTop, content;

    scrollTop = max(0, y);

    if (get(this, 'scrollTop') === scrollTop) {
      return;
    }

    // allow a visual overscroll, but don't scroll the content. As we are doing needless
    // recycyling, and adding unexpected nodes to the DOM.
    scrollTop = Math.min(scrollTop, (get(this, 'totalHeight') - get(this, 'height')));

    content = get(this, 'content');
    contentLength = get(content, 'length');
    startingIndex = this._startingIndex(contentLength);

    Ember.instrument('view._scrollContentTo', {
      scrollTop: scrollTop,
      content: content,
      startingIndex: startingIndex,
      endingIndex: min(max(contentLength - 1, 0), startingIndex + this._numChildViewsForViewport())
    }, function () {
      Ember.run(this, function(){
        set(this, 'scrollTop', scrollTop);

        maxContentIndex = max(contentLength - 1, 0);

        startingIndex = this._startingIndex();
        visibleEndingIndex = startingIndex + this._numChildViewsForViewport();

        endingIndex = min(maxContentIndex, visibleEndingIndex);

        this.trigger('scrollYChanged', y);

        if (startingIndex === this._lastStartingIndex &&
            endingIndex === this._lastEndingIndex) {
          return;
        }

        this._reuseChildren();

        this._lastStartingIndex = startingIndex;
        this._lastEndingIndex = endingIndex;
      });
    }, this);
  },

  /**
    @private

    Computes the height for a `Ember.ListView` scrollable container div.
    You must specify `rowHeight` parameter for the height to be computed properly.

    @property {Ember.ComputedProperty} totalHeight
  */
  totalHeight: Ember.computed('content.length', 'rowHeight', 'columnCount', 'bottomPadding', function() {
    var contentLength, rowHeight, columnCount, bottomPadding;

    contentLength = get(this, 'content.length');
    rowHeight = get(this, 'rowHeight');
    columnCount = get(this, 'columnCount');
    bottomPadding = get(this, 'bottomPadding');

    return ((ceil(contentLength / columnCount)) * rowHeight) + bottomPadding;
  }),

  /**
    @private
    @method _prepareChildForReuse
  */
  _prepareChildForReuse: function(childView) {
    childView.prepareForReuse();
  },

  /**
    @private
    @method _reuseChildForContentIndex
  */
  _reuseChildForContentIndex: function(childView, contentIndex) {
    var content, context, newContext, childsCurrentContentIndex, position, enableProfiling;

    content = get(this, 'content');
    enableProfiling = get(this, 'enableProfiling');
    position = this.positionForIndex(contentIndex);
    childView.updatePosition(position);

    set(childView, 'contentIndex', contentIndex);

    if (enableProfiling) {
      Ember.instrument('view._reuseChildForContentIndex', position, function(){}, this);
    }

    newContext = content.objectAt(contentIndex);
    childView.updateContext(newContext);
  },

  /**
    @private
    @method positionForIndex
  */
  positionForIndex: function(index){
    var elementWidth, width, columnCount, rowHeight, y, x;

    elementWidth = get(this, 'elementWidth') || 1;
    width = get(this, 'width') || 1;
    columnCount = get(this, 'columnCount');
    rowHeight = get(this, 'rowHeight');

    y = (rowHeight * floor(index/columnCount));
    x = (index % columnCount) * elementWidth;

    return {
      y: y,
      x: x
    };
  },

  /**
    @private
    @method _childViewCount
  */
  _childViewCount: function() {
    var contentLength, childViewCountForHeight;

    contentLength = get(this, 'content.length');
    childViewCountForHeight = this._numChildViewsForViewport();

    return min(contentLength, childViewCountForHeight);
  },

  /**
    @private

    Returns a number of columns in the Ember.ListView (for grid layout).

    If you want to have a multi column layout, you need to specify both
    `width` and `elementWidth`.

    If no `elementWidth` is specified, it returns `1`. Otherwise, it will
    try to fit as many columns as possible for a given `width`.

    @property {Ember.ComputedProperty} columnCount
  */
  columnCount: Ember.computed('width', 'elementWidth', function() {
    var elementWidth, width, count;

    elementWidth = get(this, 'elementWidth');
    width = get(this, 'width');

    if (elementWidth) {
      count = floor(width / elementWidth);
    } else {
      count = 1;
    }

    return count;
  }),

  /**
    @private

    Fires every time column count is changed.

    @event columnCountDidChange
  */
  columnCountDidChange: Ember.observer(function(){
    var ratio, currentScrollTop, proposedScrollTop, maxScrollTop,
        scrollTop, lastColumnCount, newColumnCount, element;

    lastColumnCount = this._lastColumnCount;

    currentScrollTop = get(this, 'scrollTop');
    newColumnCount = get(this, 'columnCount');
    maxScrollTop = get(this, 'maxScrollTop');
    element = get(this, 'element');

    this._lastColumnCount = newColumnCount;

    if (lastColumnCount) {
      ratio = (lastColumnCount / newColumnCount);
      proposedScrollTop = currentScrollTop * ratio;
      scrollTop = min(maxScrollTop, proposedScrollTop);

      this._scrollTo(scrollTop);
      set(this, 'scrollTop', scrollTop);
    }

    if (arguments.length > 0) {
      // invoked by observer
      Ember.run.schedule('afterRender', this, syncListContainerWidth);
    }
  }, 'columnCount'),

  /**
    @private

    Computes max possible scrollTop value given the visible viewport
    and scrollable container div height.

    @property {Ember.ComputedProperty} maxScrollTop
  */
  maxScrollTop: Ember.computed('height', 'totalHeight', function(){
    var totalHeight, viewportHeight;

    totalHeight = get(this, 'totalHeight');
    viewportHeight = get(this, 'height');

    return max(0, totalHeight - viewportHeight);
  }),

  /**
    @private

    Computes the number of views that would fit in the viewport area.
    You must specify `height` and `rowHeight` parameters for the number of
    views to be computed properly.

    @method _numChildViewsForViewport
  */
  _numChildViewsForViewport: function() {
    var height, rowHeight, paddingCount, columnCount;

    height = get(this, 'height');
    rowHeight = get(this, 'rowHeight');
    paddingCount = get(this, 'paddingCount');
    columnCount = get(this, 'columnCount');

    return (ceil(height / rowHeight) * columnCount) + (paddingCount * columnCount);
  },

  /**
    @private

    Computes the starting index of the item views array.
    Takes `scrollTop` property of the element into account.

    Is used in `_syncChildViews`.

    @method _startingIndex
  */
  _startingIndex: function(_contentLength) {
    var scrollTop, rowHeight, columnCount, calculatedStartingIndex,
        contentLength, largestStartingIndex;

    if (_contentLength === undefined) {
      contentLength = get(this, 'content.length');
    } else {
      contentLength = _contentLength;
    }

    scrollTop = get(this, 'scrollTop');
    rowHeight = get(this, 'rowHeight');
    columnCount = get(this, 'columnCount');

    calculatedStartingIndex = floor(scrollTop / rowHeight) * columnCount;

    largestStartingIndex = max(contentLength - 1, 0);

    return min(calculatedStartingIndex, largestStartingIndex);
  },

  /**
    @private
    @event contentWillChange
  */
  contentWillChange: Ember.beforeObserver(function() {
    var content;

    content = get(this, 'content');

    if (content) {
      content.removeArrayObserver(this);
    }
  }, 'content'),

  /**),
    @private
    @event contentDidChange
  */
  contentDidChange: Ember.observer(function() {
    addContentArrayObserver.call(this);
    syncChildViews.call(this);
  }, 'content'),

  /**
    @private
    @property {Function} needsSyncChildViews
  */
  needsSyncChildViews: Ember.observer(syncChildViews, 'height', 'width', 'columnCount'),

  /**
    @private

    Returns a new item view. Takes `contentIndex` to set the context
    of the returned view properly.

    @param {Number} contentIndex item index in the content array
    @method _addItemView
  */
  _addItemView: function(contentIndex){
    var itemViewClass, childView;

    itemViewClass = get(this, 'itemViewClass');
    childView = this.createChildView(itemViewClass);

    this.pushObject(childView);
   },

  /**
    @private

    Intelligently manages the number of childviews.

    @method _syncChildViews
   **/
  _syncChildViews: function(){
    var itemViewClass, startingIndex, childViewCount,
        endingIndex, numberOfChildViews, numberOfChildViewsNeeded,
        childViews, count, delta, index, childViewsLength, contentIndex;

    if (get(this, 'isDestroyed') || get(this, 'isDestroying')) {
      return;
    }

    childViewCount = this._childViewCount();
    childViews = this.positionOrderedChildViews();

    startingIndex = this._startingIndex();
    endingIndex = startingIndex + childViewCount;

    numberOfChildViewsNeeded = childViewCount;
    numberOfChildViews = childViews.length;

    delta = numberOfChildViewsNeeded - numberOfChildViews;

    if (delta === 0) {
      // no change
    } else if (delta > 0) {
      // more views are needed
      contentIndex = this._lastEndingIndex;

      for (count = 0; count < delta; count++, contentIndex++) {
        this._addItemView(contentIndex);
      }

    } else {
      // less views are needed
      forEach.call(
        childViews.splice(numberOfChildViewsNeeded, numberOfChildViews),
        removeAndDestroy,
        this
      );
    }

    this._reuseChildren();

    this._lastStartingIndex = startingIndex;
    this._lastEndingIndex   = this._lastEndingIndex + delta;
  },

  /**
    @private
    @method _reuseChildren
  */
  _reuseChildren: function(){
    var contentLength, childViews, childViewsLength,
        startingIndex, endingIndex, childView, attrs,
        contentIndex, visibleEndingIndex, maxContentIndex,
        contentIndexEnd, scrollTop;

    scrollTop = get(this, 'scrollTop');
    contentLength = get(this, 'content.length');
    maxContentIndex = max(contentLength - 1, 0);
    childViews = this.getReusableChildViews();
    childViewsLength =  childViews.length;

    startingIndex = this._startingIndex();
    visibleEndingIndex = startingIndex + this._numChildViewsForViewport();

    endingIndex = min(maxContentIndex, visibleEndingIndex);

    contentIndexEnd = min(visibleEndingIndex, startingIndex + childViewsLength);

    for (contentIndex = startingIndex; contentIndex < contentIndexEnd; contentIndex++) {
      childView = childViews[contentIndex % childViewsLength];
      this._reuseChildForContentIndex(childView, contentIndex);
    }
  },

  /**
    @private
    @method getReusableChildViews
  */
  getReusableChildViews: function() {
    return this._childViews;
  },

  /**
    @private
    @method positionOrderedChildViews
  */
  positionOrderedChildViews: function() {
    return this.getReusableChildViews().sort(sortByContentIndex);
  },

  arrayWillChange: Ember.K,

  /**
    @private
    @event arrayDidChange
  */
  // TODO: refactor
  arrayDidChange: function(content, start, removedCount, addedCount) {
    var index, contentIndex;

    if (this.state === 'inDOM') {
      // ignore if all changes are out of the visible change
      if( start >= this._lastStartingIndex || start < this._lastEndingIndex) {
        index = 0;
        // ignore all changes not in the visible range
        // this can re-position many, rather then causing a cascade of re-renders
        forEach.call(
          this.positionOrderedChildViews(),
          function(childView) {
            contentIndex = this._lastStartingIndex + index;
            this._reuseChildForContentIndex(childView, contentIndex);
            index++;
          },
          this
        );
      }

      syncChildViews.call(this);
    }
  }
});

})();



(function() {
var get = Ember.get, set = Ember.set;

/**
  The `Ember.ListView` view class renders a
  [div](https://developer.mozilla.org/en/HTML/Element/div) HTML element,
  with `ember-list-view` class.

  The context of each item element within the `Ember.ListView` are populated
  from the objects in the `Element.ListView`'s `content` property.

  ### `content` as an Array of Objects

  The simplest version of an `Ember.ListView` takes an array of object as its
  `content` property. The object will be used as the `context` each item element
  inside the rendered `div`.

  Example:

  ```javascript
  App.ContributorsRoute = Ember.Route.extend({
    model: function() {
      return [{ name: 'Stefan Penner' }, { name: 'Alex Navasardyan' }, { name: 'Ray Cohen'}];
    }
  });
  ```

  ```handlebars
  {{#ember-list items=contributors height=500 rowHeight=50}}
    {{name}}
  {{/ember-list}}
  ```

  Would result in the following HTML:

  ```html
   <div id="ember181" class="ember-view ember-list-view" style="height:500px;width:500px;position:relative;overflow:scroll;-webkit-overflow-scrolling:touch;overflow-scrolling:touch;">
    <div class="ember-list-container">
      <div id="ember186" class="ember-view ember-list-item-view" style="-webkit-transform: translate3d(0px, 0px, 0);">
        <script id="metamorph-0-start" type="text/x-placeholder"></script>Stefan Penner<script id="metamorph-0-end" type="text/x-placeholder"></script>
      </div>
      <div id="ember187" class="ember-view ember-list-item-view" style="-webkit-transform: translate3d(0px, 50px, 0);">
        <script id="metamorph-1-start" type="text/x-placeholder"></script>Alex Navasardyan<script id="metamorph-1-end" type="text/x-placeholder"></script>
      </div>
      <div id="ember188" class="ember-view ember-list-item-view" style="-webkit-transform: translate3d(0px, 100px, 0);">
        <script id="metamorph-2-start" type="text/x-placeholder"></script>Rey Cohen<script id="metamorph-2-end" type="text/x-placeholder"></script>
      </div>
      <div id="ember189" class="ember-view ember-list-scrolling-view" style="height: 150px"></div>
    </div>
  </div>
  ```

  By default `Ember.ListView` provides support for `height`,
  `rowHeight`, `width`, `elementWidth`, `scrollTop` parameters.

  Note, that `height` and `rowHeight` are required parameters.

  ```handlebars
  {{#ember-list items=this height=500 rowHeight=50}}
    {{name}}
  {{/ember-list}}
  ```

  If you would like to have multiple columns in your view layout, you can
  set `width` and `elementWidth` parameters respectively.

  ```handlebars
  {{#ember-list items=this height=500 rowHeight=50 width=500 elementWidth=80}}
    {{name}}
  {{/ember-list}}
  ```

  ### extending `Ember.ListView`

  Example:

  ```handlebars
  {{view App.ListView contentBinding="content"}}

  <script type="text/x-handlebars" data-template-name="row_item">
    {{name}}
  </script>
  ```

  ```javascript
  App.ListView = Ember.ListView.extend({
    height: 500,
    width: 500,
    elementWidth: 80,
    rowHeight: 20,
    itemViewClass: Ember.ListItemView.extend({templateName: "row_item"})
  });
  ```

  @extends Ember.ContainerView
  @class ListView
  @namespace Ember
*/
Ember.ListView = Ember.ContainerView.extend(Ember.ListViewMixin, {
  css: {
    position: 'relative',
    overflow: 'scroll',
    '-webkit-overflow-scrolling': 'touch',
    'overflow-scrolling': 'touch'
  },

  applyTransform: Ember.ListViewHelper.applyTransform,

  _scrollTo: function(scrollTop) {
    var element = get(this, 'element');

    if (element) { element.scrollTop = scrollTop; }
  },

  didInsertElement: function() {
    var that = this,
        element = get(this, 'element');

    this._updateScrollableHeight();

    this._scroll = function(e) { that.scroll(e); };

    Ember.$(element).on('scroll', this._scroll);
  },

  willDestroyElement: function() {
    var element;

    element = get(this, 'element');

    Ember.$(element).off('scroll', this._scroll);
  },

  scroll: function(e) {
    this.scrollTo(e.target.scrollTop);
  },

  scrollTo: function(y){
    var element = get(this, 'element');
    this._scrollTo(y);
    this._scrollContentTo(y);
  },

  totalHeightDidChange: Ember.observer(function () {
    Ember.run.scheduleOnce('afterRender', this, this._updateScrollableHeight);
  }, 'totalHeight'),

  _updateScrollableHeight: function () {
    if (this.state === 'inDOM') {
      this.$('.ember-list-container').css({
        height: get(this, 'totalHeight')
      });
    }
  }
});

})();



(function() {
var fieldRegex = /input|textarea|select/i,
  hasTouch = ('ontouchstart' in window) || window.DocumentTouch && document instanceof window.DocumentTouch,
  handleStart, handleMove, handleEnd, handleCancel,
  startEvent, moveEvent, endEvent, cancelEvent;
if (hasTouch) {
  startEvent = 'touchstart';
  handleStart = function (e) {
    var touch = e.touches[0],
      target = touch && touch.target;
    // avoid e.preventDefault() on fields
    if (target && fieldRegex.test(target.tagName)) {
      return;
    }
    bindWindow(this.scrollerEventHandlers);
    this.willBeginScroll(e.touches, e.timeStamp);
    e.preventDefault();
  };
  moveEvent = 'touchmove';
  handleMove = function (e) {
    this.continueScroll(e.touches, e.timeStamp);
  };
  endEvent = 'touchend';
  handleEnd = function (e) {
    // if we didn't end up scrolling we need to
    // synthesize click since we did e.preventDefault()
    // on touchstart
    if (!this._isScrolling) {
      synthesizeClick(e);
    }
    unbindWindow(this.scrollerEventHandlers);
    this.endScroll(e.timeStamp);
  };
  cancelEvent = 'touchcancel';
  handleCancel = function (e) {
    unbindWindow(this.scrollerEventHandlers);
    this.endScroll(e.timeStamp);
  };
} else {
  startEvent = 'mousedown';
  handleStart = function (e) {
    if (e.which !== 1) return;
    var target = e.target;
    // avoid e.preventDefault() on fields
    if (target && fieldRegex.test(target.tagName)) {
      return;
    }
    bindWindow(this.scrollerEventHandlers);
    this.willBeginScroll([e], e.timeStamp);
    e.preventDefault();
  };
  moveEvent = 'mousemove';
  handleMove = function (e) {
    this.continueScroll([e], e.timeStamp);
  };
  endEvent = 'mouseup';
  handleEnd = function (e) {
    unbindWindow(this.scrollerEventHandlers);
    this.endScroll(e.timeStamp);
  };
  cancelEvent = 'mouseout';
  handleCancel = function (e) {
    if (e.relatedTarget) return;
    unbindWindow(this.scrollerEventHandlers);
    this.endScroll(e.timeStamp);
  };
}

function handleWheel(e) {
  this.mouseWheel(e);
  e.preventDefault();
}

function bindElement(el, handlers) {
  el.addEventListener(startEvent, handlers.start, false);
  el.addEventListener('mousewheel', handlers.wheel, false);
}

function unbindElement(el, handlers) {
  el.removeEventListener(startEvent, handlers.start, false);
  el.removeEventListener('mousewheel', handlers.wheel, false);
}

function bindWindow(handlers) {
  window.addEventListener(moveEvent, handlers.move, true);
  window.addEventListener(endEvent, handlers.end, true);
  window.addEventListener(cancelEvent, handlers.cancel, true);
}

function unbindWindow(handlers) {
  window.removeEventListener(moveEvent, handlers.move, true);
  window.removeEventListener(endEvent, handlers.end, true);
  window.removeEventListener(cancelEvent, handlers.cancel, true);
}

Ember.VirtualListScrollerEvents = Ember.Mixin.create({
  init: function() {
    this.on('didInsertElement', this, 'bindScrollerEvents');
    this.on('willDestroyElement', this, 'unbindScrollerEvents');
    this.scrollerEventHandlers = {
      start: bind(this, handleStart),
      move: bind(this, handleMove),
      end: bind(this, handleEnd),
      cancel: bind(this, handleCancel),
      wheel: bind(this, handleWheel)
    };
    return this._super();
  },
  bindScrollerEvents: function() {
    var el = this.get('element'),
      handlers = this.scrollerEventHandlers;
    bindElement(el, handlers);
  },
  unbindScrollerEvents: function() {
    var el = this.get('element'),
      handlers = this.scrollerEventHandlers;
    unbindElement(el, handlers);
    unbindWindow(handlers);
  }
});

function bind(view, handler) {
  return function (evt) {
    handler.call(view, evt);
  };
}

function synthesizeClick(e) {
  var point = e.changedTouches[0],
    target = point.target,
    ev;
  if (target && fieldRegex.test(target.tagName)) {
    ev = document.createEvent('MouseEvents');
    ev.initMouseEvent('click', true, true, e.view, 1, point.screenX, point.screenY, point.clientX, point.clientY, e.ctrlKey, e.altKey, e.shiftKey, e.metaKey, 0, null);
    return target.dispatchEvent(ev);
  }
}

})();



(function() {
/*global Scroller*/
var max = Math.max, get = Ember.get, set = Ember.set;

function updateScrollerDimensions(target) {
  var width, height, totalHeight;

  target = target || this;

  width = get(target, 'width');
  height = get(target, 'height');
  totalHeight = get(target, 'totalHeight');

  target.scroller.setDimensions(width, height, width, totalHeight);
  target.trigger('scrollerDimensionsDidChange');
}

/**
  VirtualListView

  @class VirtualListView
  @namespace Ember
*/
Ember.VirtualListView = Ember.ContainerView.extend(Ember.ListViewMixin, Ember.VirtualListScrollerEvents, {
  _isScrolling: false,
  _mouseWheel: null,
  css: {
    position: 'relative',
    overflow: 'hidden'
  },

  init: function(){
    this._super();
    this.setupScroller();
    this.setupPullToRefresh();
  },
  _scrollerTop: 0,
  applyTransform: Ember.ListViewHelper.apply3DTransform,

  setupScroller: function(){
    var view, y;

    view = this;

    view.scroller = new Scroller(function(left, top, zoom) {
      if (view.state !== 'inDOM') { return; }

      if (view.listContainerElement) {
        view._scrollerTop = top;
        view._scrollContentTo(top);
        view.applyTransform(view.listContainerElement, 0, -top);
      }
    }, {
      scrollingX: false,
      scrollingComplete: function(){
        view.trigger('scrollingDidComplete');
      }
    });

    view.trigger('didInitializeScroller');
    updateScrollerDimensions(view);
  },
  setupPullToRefresh: function() {
    if (!this.pullToRefreshViewClass) { return; }
    this._insertPullToRefreshView();
    this._activateScrollerPullToRefresh();
  },
  _insertPullToRefreshView: function(){
    this.pullToRefreshView = this.createChildView(this.pullToRefreshViewClass);
    this.insertAt(0, this.pullToRefreshView);
    var view = this;
    this.pullToRefreshView.on('didInsertElement', function(){
      Ember.run.schedule('afterRender', this, function(){
        view.applyTransform(this.get('element'), 0, -1 * view.pullToRefreshViewHeight);
      });
    });
  },
  _activateScrollerPullToRefresh: function(){
    var view = this;
    function activatePullToRefresh(){
      view.pullToRefreshView.set('active', true);
      view.trigger('activatePullToRefresh');
    }
    function deactivatePullToRefresh() {
      view.pullToRefreshView.set('active', false);
      view.trigger('deactivatePullToRefresh');
    }
    function startPullToRefresh() {
      Ember.run(function(){
        view.pullToRefreshView.set('refreshing', true);

        function finishRefresh(){
          if (view && !view.get('isDestroyed') && !view.get('isDestroying')) {
            view.scroller.finishPullToRefresh();
            view.pullToRefreshView.set('refreshing', false);
          }
        }
        view.startRefresh(finishRefresh);
      });
    }
    this.scroller.activatePullToRefresh(
      this.pullToRefreshViewHeight,
      activatePullToRefresh,
      deactivatePullToRefresh,
      startPullToRefresh
    );
  },

  getReusableChildViews: function(){
    var firstView = this._childViews[0];
    if (firstView && firstView === this.pullToRefreshView) {
      return this._childViews.slice(1);
    } else {
      return this._childViews;
    }
  },

  scrollerDimensionsNeedToChange: Ember.observer(function() {
    Ember.run.once(this, updateScrollerDimensions);
  }, 'width', 'height', 'totalHeight'),

  didInsertElement: function() {
    this.listContainerElement = this.$('> .ember-list-container')[0];
  },

  willBeginScroll: function(touches, timeStamp) {
    this._isScrolling = false;
    this.trigger('scrollingDidStart');

    this.scroller.doTouchStart(touches, timeStamp);
  },

  continueScroll: function(touches, timeStamp) {
    Ember.run(this, function(){
      var startingScrollTop, endingScrollTop, event;

      if (this._isScrolling) {
        this.scroller.doTouchMove(touches, timeStamp);
      } else {
        startingScrollTop = this._scrollerTop;

        this.scroller.doTouchMove(touches, timeStamp);

        endingScrollTop = this._scrollerTop;

        if (startingScrollTop !== endingScrollTop) {
          event = Ember.$.Event("scrollerstart");
          Ember.$(touches[0].target).trigger(event);

          this._isScrolling = true;
        }
      }
    });
  },

  endScroll: function(timeStamp) {
    this.scroller.doTouchEnd(timeStamp);
  },

  // api
  scrollTo: function(y, animate) {
    if (animate === undefined) {
      animate = true;
    }

    this.scroller.scrollTo(0, y, animate, 1);
  },

  // events
  mouseWheel: function(e){
    var inverted, delta, candidatePosition;

    inverted = e.webkitDirectionInvertedFromDevice;
    delta = e.wheelDeltaY * (inverted ? 0.8 : -0.8);
    candidatePosition = this.scroller.__scrollTop + delta;

    if ((candidatePosition >= 0) && (candidatePosition <= this.scroller.__maxScrollTop)) {
      this.scroller.scrollBy(0, delta, true);
    }

    return false;
  }
});

})();



(function() {
Ember.Handlebars.registerHelper('ember-list', function emberList(options) {
  var hash = options.hash;
  var types = options.hashTypes;

  hash.content = hash.items;
  delete hash.items;

  types.content = types.items;
  delete types.items;

  if (!hash.content) {
    hash.content = "this";
    types.content = "ID";
  }

  for (var prop in hash) {
    if (/-/.test(prop)) {
      var camelized = Ember.String.camelize(prop);
      hash[camelized] = hash[prop];
      types[camelized] = types[prop];
      delete hash[prop];
      delete types[prop];
    }
  }

  return Ember.Handlebars.helpers.collection.call(this, 'Ember.ListView', options);
});


})();



(function() {

})();

});

;require.register("views/post_view", function(exports, require, module) {
App.PostView = Em.View.extend({
  classNames: ['post'],
  tagName: 'article',
});

});

;require.register("views/posts_view", function(exports, require, module) {
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

});

;require.register("envs/development/env", function(exports, require, module) {
'use strict';

module.exports = 'development';

});

;
//# sourceMappingURL=app.js.map