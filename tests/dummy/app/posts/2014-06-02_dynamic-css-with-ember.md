---
title: Dynamic CSS with Ember
description: At Jebbit we build a lot of white-label products that require dynamic styling to load. We'll show you one technique we use for generating client-side dynamic CSS.
published: 2014-06-02
author: Jebbit
categories:
 - ember
 - design
---

The flexibility of Ember views provides for a huge range of useful applications. In this post, we'll use an Ember view to wrap and render CSS styling for a specific route.

Let's say we have some CSS we want to customize depending on which brand's route the user is on (for example, the way Twitter customizes link colors depending on the theme of the profile you're viewing). It might look something like this:

```css

.header {
  background-color: ; // Brand color 1 here
}

.link {
  color: ; // Brand color 2 here
}
```

First, we setup our view to be rendered as a style tag (let's say it's css for a customizable header. Then, we save the css as a handlebars file in our templates directory. Let's save it inside `templates/css`:

```js
App.HeaderCssView = Em.View.extend({
  tagName: 'style',
  templateName: 'css/header_css',
});

```

HTML5 does not require the `type` attribute so we'll leave it out. However, you can add `attributeBindings: ['type']` with a property `type: 'text/css'` to bind the type, if you so require.

Now, assuming we're loading the required colors as part of the model, binding our colors is as easy as using the Handlebars `unbound` helper in our template. For example:

```handlebars
.header {
  background-color: {{unbound primaryColor}};
}

.link {
  color: {{unbound secondaryColor}};
}
```

The end result is a stylesheet block that will be rendered on the page whenever you place `{{view 'headerCss'}}` in your template.

In a future post we'll be covering some core coloring methods you can use in any JavaScript app.

If you've come across a better way to add dynamic styling to a page client-side, let us know in the comments below! We'd love to hear about the different methods employed.

---

Further Reading
------

- [A Rails-ember approach to dynamic CSS](//spin.atomicobject.com/2013/12/21/dynamically-generate-css/)
- [Ember View Class properties](//emberjs.com/api/classes/Ember.View.html#property_actions)
