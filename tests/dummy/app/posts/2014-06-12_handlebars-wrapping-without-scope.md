---
title: Handlebars Wrapping Without Scope
description: Ember components can be useful for wrapping Handlebars code in other code, but they create scope. We discuss a method for scopeless code-wrapping in Handlebars templates.
published: 2014-06-12
author: Jebbit
categories:
 - ember
---

The Problem
------

The Ember guides document a maintainable, reusable way to [wrap content with code using a component](http://emberjs.com/guides/components/wrapping-content-in-a-component/). This is a great way to DRY-up your templates. For example, instead of writing:

```handlebars
<ul role="menu" class="list-unstyled">
  {{!--Some content--}}
</ul>
```

You can write:

```handlebars
{{#unstyled-list}}
  {{!--some content--}}
{{/unstyled-list}}
```

This may only save a few words of typing but when you go to change the base class in ten different templates, or decide you want to wrap the list in some `div`, you'll find this to be a very maintainable pattern to follow.

Using components to achieve the above outcome is often very advantegous as the view and controller scope created by the component allow you to handle user interaction and track properties uniquely.

> There are some situations in which you do not want any scope created

However, there are some situations in which you do not want any scope created (i.e. you want properties bound to the current view and controller) but you still want the advantages of wrapping content in a maintainable way. Enter: Handlebars helpers and the buffer.

The Solution
------

First, let's set up our helper... `registerHelper` does not bind arguments to properties but allows us to use the helper as a Handlebars block. This is perfect for rendering static HTML and, as you'll see, we can still pass arguments as if the helper is a component.

```js
Em.Handlebars.registerHelper('unstyled-list', function(options) {

});
```

<p class="endnote">N.B. We define `options` as an argument but we do not have to specify it in the Handlebars - it is always available within helpers.</p>

Now, let's set our opening and closing lines of HTML as variables:

```js
Em.Handlebars.registerHelper('unstyled-list', function(options) {
  var open = '<ul role="menu" class="list-unstyled">';
  var close = '</ul>';
});
```

Because we're probably going to use this wrapping function in many different helpers like our `unstyled-list` helper, we should specify the function on a global `Utilities` namespace. Let's define the namespace:

```js
Utils = Em.Namespace.create();
```

And now for the magic part: we're going to push to the buffer before and after the contents of out Handlebars block are rendered. The buffer is simply the queue of HTML code to be rendered into the view.

We'll pass in the opening and closing HTML as arguments, plus the context of the `unstyled-list` helper in the form of the helper's `options` and the helper object itself:

```js
Utils.wrapBuffer = function(open, close, options, helper) {

}
```

Let's make sure we're calling this function in our helper:

```js
Em.Handlebars.registerHelper('unstyled-list', function(options) {
  var open = '<ul role="menu" class="list-unstyled">';
  var close = '</ul>';

  return Utils.wrapBuffer(open, close, options, this);
});
```

The property `options.data.buffer` references the buffer. To push to the buffer we simply call `options.data.buffer.push('some code here')`. So, that's where we'll start:

```js
Utils.wrapBuffer = function(open, close, options, helper) {
  options.data.buffer.push(open);
}
```

This will render our opening HTML string in place of `{{#unstyled-list}}{{!--some content--}}{{/unstyled-list}}`. Great! But how do we render the content inside the block next?

Block helpers have access to the `options.fn()` method. `fn()` renders the content of the block. It accepts the helper as it's one and only argument. Thus, we can run `options.fn(helper)` and push the result to the buffer.

```js
Utils.wrapBuffer = function(open, close, options, helper) {
  options.data.buffer.push(open);

  if (options.fn) {
    options.data.buffer.push(options.fn(context));
  }
}
```

There are times, during initialization when `fn()` is not available so, to avoid temporary errors, we wrap the call in an `if` statement.

Finally, all that's left to do is to push our closing HTML to the buffer and add some stylistic line breaks to make our code look a little nicer in the console:

```js
Utils.wrapBuffer = function(open, close, options, helper) {
  options.data.buffer.push('\n' + open);

  if (options.fn(context)) {
    options.data.buffer.push('\n' + options.fn(helper));
  }

  options.data.buffer.push('\n' + close);
}
```

The result is that whatever we place inside the `{{unstyled-list}}` helpers will be wrapped by our `<ul>` but the Handlebars scope will remain unchanged.

Passing Arguments
------

'But what about passing arguments?!' you say. Well, that part's pretty easy.

Imagine we want to pass a `center` argument to our `{{unstyled-list}}` to modify the outputted HTML in some way. We don't want to use plain helper arguments with block helpers because they can become hard to understanding the meaning of. For example:

```handlebars
{{#unstyled-list true}}
  // ...
{{/unstyled-list}}
```

We'd much rather use syntax like:

```handlebars
{{#unstyled-list center='true'}}
  // ...
{{/unstyled-list}}
```

To access this center property in our helper simply inspect the options hash for the `center` property and modify the `open` and `close` variables as follows:

```js
Em.Handlebars.registerHelper('unstyled-list', function(options) {
  var center = options.hash.center;
  var open = center ? 'some code' : 'some other code';

  // Blah blah blah...
});
```

Easy!

Now you can make large swathes of your HTML templates maintainable and easy to work with. Use cases include any and every part of your application including page layout, modals, forms, calls to action, lists, and more where the content inside the block will change from use case to use case.

---

Further Reading
------

- [Ember.helper vs Ember.registerHelper](http://stackoverflow.com/questions/18004510/whats-the-difference-between-handlebars-helpers-and-ember-handlebars-helpers)
- [Custom link-to helpers in Ember](http://www.thesoftwaresimpleton.com/blog/2014/01/11/custome-link-to/)
- [Wrapping content in a component](http://emberjs.com/guides/components/wrapping-content-in-a-component/)
