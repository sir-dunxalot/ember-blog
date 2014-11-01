---
title: EasyForm Error Messages
description: Ember EasyForm is a great tool for simplifying the development of semantic forms in your Ember UI but there are a couple of changes you can make to handle Ember Validation error messages more effectively.
published: 2014-08-12
author: Jebbit
categories:
 - ember
---

[Ember EasyForm](https://github.com/dockyard/ember-easyForm) from [Dockyard](http://dockyard.com/) is a must-have for any Ember app requiring input from the user and, chances are, you're already using it.

This post covers ways to address two common EasyForm pain points: error formatting and showing errors on form submission. These functions and the applicability of the code in our subsequent post are highly dependent on the complementary [Ember Validations](https://github.com/dockyard/ember-validations) library.

{{#link-to 'post' 'extending-ember-easyform'}}In this previous post{{/link-to}} we cover maintainable ways to add additional functionality by reopening the base EasyForm classes. Such functions include styling valid inputs and adding custom input types.

##Error formatting

By default, EasyForm formats [Ember Validations](https://github.com/dockyard/ember-validations) error messages without the property name. For example, testing for the `name` property's prescence yields the error message:

```html
can't be blank
```

However, a more user-friendly error message might look like:

```html
Name can't be blank
```

The error text is bound to a property on the `Em.EasyForm.Error` class called `errorText`. We can overwrite this property by reopening the error class as follows:

```js
Em.EasyForm.Error.reopen({
  errorText: function() {
    var propertyName = this.get('parentView.label') || this.get('property') || '';

    return Em.EasyForm.humanize(propertyName) + ' ' + this.get('errors.firstObject');
  }.property('errors.[]', 'value'),
});
```

This new property will prepend the original error message with whatever text has or would have been rendered as the label (i.e. the label or the property name). Easy!

##Showing Errors on Submission

Several open [Github issues](https://github.com/dockyard/ember-easyForm/issues/50) hint at the importance of showing all error messages on form submission, but the solution is fairly simple.

Everyone who's looked into the EasyForm source probably knows that validation errors show on `focusOut` of the Input class (the view that wraps each `Em.Input`).

At Jebbit we use our own form submission components and mixins to handle all form events but the pure EasyForm solution is similar.

In our submit method, for each child view, we check whether it is an EasyForm input and, if it is, we call the aforementioned `focusOut` method that shows the error message. Easy!

```js
submit: function() {
  this.get('childViews').forEach(function(view) {
    if (view.get('constructor').toString() === 'Ember.EasyForm.Input') {
      view.focusOut();
    }
  });
}
```

If you're using `{{#form-for model}}` to wrap your forms, the solution will look similar to:

```
Em.EasyForm.Form.reopen({
  canShowValidationErrors: function() {
      this.get('childViews').forEach(function(view) {
      if (view.get('constructor').toString() === 'Ember.EasyForm.Input') {
        view.focusOut();
      }
    });
  }.on('submit'),
});
```

---

Further Reading
------

- [Ember EasyForm source](https://github.com/dockyard/ember-easyForm)
- [Ember Validations](https://github.com/dockyard/ember-validations)
- [Dockyard - web and mobile applications](http://dockyard.com/)
- {{#link-to 'post' 'extending-ember-easyform'}}Extending Ember EasyForm{{/link-to}}
