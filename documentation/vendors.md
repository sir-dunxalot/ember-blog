Vendors & Third-party Integrations
======

UI
------

- [responsive-nav.js](//github.com/viljamis/responsive-nav.js) is used for hiding and showing the navigation options at small window widths
- All [Twitter Bootstrap](//getbootstrap.com/) styles and components are available to use (though core themes do not extensively use Bootstrap components)
- Layout and themes are written in [SASS](//sass-lang.com/) with [Compass](//compass-style.org/) support added using [sass-brunch](//github.com/brunch/sass-brunch)
- Code highlighting in posts is done using [Highlight.js](http://highlightjs.org/)
- [HTML5 Boilerplate](//html5boilerplate.com/)-based application template
- [Modernizr](//modernizr.com/) feature detection

Stack
------

- [Node.js](//nodejs.org/) web server is used for super-fast development (hence, [npm](//www.npmjs.org/) is used for most dependency management)
- [Brunch.io](//brunch.io/) is a build tool is used for compiling and live reloading (e.g. parsing post markdown and generating html blog posts)
- [Ember.js](//emberjs.com/) is the MVC framework that generates a one-page app for your blog. It's integrated with Brunch using the [brunch-with-ember-reloaded](https://github.com/gcollazo/brunch-with-ember-reloaded) skeleton
- Ember uses [Handlebars](http://handlebarsjs.com/) for templating
- Ember requires [jQuery](http://jquery.com/). Hence, jQuery comes as standard

Deployment
------

- Built to run on [Github Pages](//pages.github.com/) with a simple push to master branch

Accessibility & SEO
------

- [Microformatting](//microformats.org/wiki/microformats2#h-entry) of all blog posts and lists
- [ARIA](//developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA) integration throughout the app
- [Semantic HTML5](//html5doctor.com/lets-talk-about-semantics/)

Analytics
------

- [Google Analytics](//www.google.com/analytics/) integration using [ember-google-analytics](//github.com/ryanto/ember-google-analytics)

Testing
------

- Testing driven with [QUnit](//qunitjs.com/) and [Karma](//karma-runner.github.io/0.12/index.html), though no tests are written yet
