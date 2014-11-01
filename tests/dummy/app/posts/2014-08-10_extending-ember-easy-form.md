---
title: Extending Ember EasyForm
description: Ember EasyForm makes maintaining forms in Ember apps a breeze. We cover how to add advanced EasyForm functionalities to your app without editing the EasyForm source.
published: 2014-08-10
author: Jebbit
categories:
 - ember
---

[Ember EasyForm](https://github.com/dockyard/ember-easyForm) from [Dockyard](http://dockyard.com/) makes using semantic forms in your Ember apps... easy!

In this post we will cover maintainable ways to add additional functionality to your forms by reopening the base EasyForm classes. Specifically, we will cover styling valid inputs and adding custom input types.

Formatting and showing EasyForm's error messages is covered in more detail {{#link-to 'post' 'easyform-error-messages'}}in this post{{/link-to}}.

Styling Valid Inputs
------

When an input goes from invalid to valid the error messages disappear. However, sometimes that is not enough of a visual cue to the user. Instead you may want the newly validated input to flash a little green check or have a green border, etc.

EasyForm's Input class (the view that wraps the Em.Input) doesn't have a valid class by default, so we have to add one with a `classNameBinding` we can use to target our CSS styles - let's call the property `showValidity`.

Our trigger to show validity will be when `Em.EasyForm.Input`'s `showError` property goes from `true` to `false`. Thus, our method and property will look like:

```js
Em.EasyForm.Input.reopen({
  classNameBindings: ['showValidity'],
  showValidity: false,

  setInvalidToValid: function() {
    if (!this.get('showError')) {
      // We have gone from an error to no errors
    }
  }.observes('showError'),

});
```

<p class="endnote">N.B. You'll soon see why we're not using a computed property.</p>

However, as you'll find out when you try this, `showError` is also set to true when the user focuses out of a valid input. Furthermore, a rapid sucession of changes to `showError` occurs at times.

The solution to this problem is to check whether `Em.EasyForm.Input`'s `canShowValidationError` property is `true`, which happens to be the case when the user focuses out of the input. Secondly, to overcome the multiple property change issue we just have to debounce the function. And so, we now have:

```js
Em.EasyForm.Input.reopen({
  classNameBindings: ['showValidity'],
  showValidity: false,

  setInvalidToValid: function() {
    Em.run.debounce(this, function() {
      if (!this.get('showError') && this.get('canShowValidationError')) {
        // We have gone from an error to no errors
      }
    }, 50);
  }.observes('showError'),

});
```

Since we have debounced the method, we now check to see whether the property has newly associated validation errors and, if not, set `showValidity` to true, allowing our css to target and style the, now, valid input.

```js
Em.EasyForm.Input.reopen({
  classNameBindings: ['showValidity'],
  showValidity: false,

  setInvalidToValid: function() {
    Em.run.debounce(this, function() {
      var hasAnError = this.get('formForModel.errors.' + this.get('property') + '.length');

      if (!hasAnError) {
        this.set('showValidity', true);

        // Only bind styling for 1500ms
        Em.run.later(this, function() {
          this.set('showValidity', false);
        }, 1500);
      }
    }, 50);
  }.observes('showError'),

});
```

The above example removes the class binding after a given period of time (1500ms) so the styling is flashed to the user before returning the input to the usual input style state.

Custom Input Types
------

EasyForm's API is well built and allows you to easily extend the base classes to create new inputs. These inputs might be cross-browser colorpickers, file upload buttons, or radio button groups.

Whilst you could use EasyForm's block helpers to render custom HTML inside the `Em.EasyForm.Input` class, registering custom inputs is very DRY and maintainable. For example, integrating a file upload button with your existing form layout and validation handling could be as simple as:

```handlebars
{{input logoUrl as='file'}}
```

In this example, we're going to implement a simplified WYSIWYG editor helper for our EasyForm using [jQueryte](http://jqueryte.com/).

The first step is to extend an existing EasyForm class to create a new input field view. We typically extend `Em.EasyForm.TextArea` (for `<textarea>`s), `Em.EasyForm.TextField` (for `<input>`s), or `Em.EasyForm.BaseView` (for everything else).

The 'architecture' of EasyForm is to wrap each group of control views (consisting of a label field, input field, error field, and hint field) in an 'input' view. So what we're doing is registering a new class for the input field element - EasyForm's wrapping input class will be unchanged. This allows our new input field to be seamlessly integrated with your existing EasyForm setup and layout.


###Step 1 - Create the Class

First we register our new input field class by extending our chosen base class:

```js
Em.EasyForm.WYSIWYG = Em.EasyForm.TextArea.extend({

});
```

###Step 2 - Initiate the Plugin

jQuery plugins usually ask you to call a method like `$('.text_editor').renderSomething()` to initiate your plugin. Inside of our new EasyForm class, `this.$()` will be a reference to the jQuery object of the input field. So, to run the jQuery method that renders our WYSIWYG text editor (`jqte()`), we make the call on that object:

```js
Em.EasyForm.WYSIWYG = Em.EasyForm.TextArea.extend({

  renderEditor: function() {
    this.$().jqte();
  }.on('didInsertElement'),

});
```

In reality, you're probably going to pass in some options to that method too:

```js
Em.EasyForm.WYSIWYG = Em.EasyForm.TextArea.extend({

  renderEditor: function() {
    this.$().jqte({
      color: false,
      fsize: false,
      format: false
    });
  }.on('didInsertElement'),

});
```

###Step 3 - Bind the value

While many effective input-customizing plugins automatically bind changed values to the original `<input>` element, most jQuery WYSIWYG editors replace the original input with a div that has a `contenteditable` attribute. Thus, we need to bind the content of our editable div to the input class' value every time the content changes. This is as easy as setting the `value` property on the input field view:

```js
this.set('value', this.get('parentView').$().find('.jqte_editor').html()); // Or whatever our value it
```

###Step 4 - Register the Input Type

Finally, to enable us to use our awesome, new input field inside EasyForm's input view we have to register the type. We do this after declaring the class:

```js
Em.EasyForm.WYSIWYG = Em.EasyForm.TextArea.extend({
  // Input field stuff inside here...
});

// Register type for our use
Em.EasyForm.Config.registerInputType('wysiwyg', Em.EasyForm.WYSIWYG);
```

The first argument for `registerInputType` corresponds to the `as` property in your handlebars helper (`{{input someValue as='yourTypeHere'}}`). Thus, we can now use our new input field type as follows:

```handlebars
{{input bodyContent as='wysiwyg'}}
```

You can also use this input field type in block inputs:

```handlebars
{{#input bodyContent}}
  <div class="extra wrapper">
    {{input-field bodyContent as='wysiwyg'}}
  </div>
{{/input}}
```

See the full code for the [simple Ember WYSIWYG editor here](https://github.com/sir-dunxalot/ember-easyForm-wysiwyg).

If you want to make your own WUSIWYG input, consider using [Summernote](http://hackerwins.github.io/summernote/), which is built on Bootstrap 3.

---

Further Reading
------

- [EasyForm docs](https://github.com/dockyard/ember-easyForm)
- [Dockyard - web and mobile applications](http://dockyard.com/)
- {{#link-to 'post' 'easyform-error-messages'}}Formatting and showing EasyForm error messages{{/link-to}}
- [Radio buttons in Ember](https://github.com/sir-dunxalot/ember-radio-buttons)
- [Ember form handlers](https://github.com/sir-dunxalot/ember-form-handlers)
