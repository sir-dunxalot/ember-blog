---
title: Detecting Touchscreen Monitors
description: Since the implementation of touch events in desktop browsers, there hasn't been a reliable way to avoid serving the user touch experiences when they are using a desktop computer with a touchscreen monitor. We discuss one method that is easy to implement but reliable.
published: 2014-08-14
author: Jebbit
categories:
 - ember
 - design
---

There is an ongoing argument about whether it's 'right' to try to detect touch support but in the practical world of web development it's sometimes unavoidable. For a short time, detecting a touch device using JavaScript worked something like:

```
if (Modernizr.touch) {
  this.set('enableTouchExperience', true);
}
```

However, some laptops like the [Lenovo Z500](http://shop.lenovo.com/ae/en/laptops/lenovo/z-series/z500-touch/?ipromoID=ae_touch_z500-touch) or any desktop device using a touchscreen monitor have native support for both touch and mouse events. Furthermore, some desktop browsers like Chrome now come packaged with support for touch events.

As such, testing for the *presence* of touch event support to present the user with a touch-powered experience is not an effective solution.

But, never fear! There is a potential solution... [Here is a working JS Bin](http://emberjs.jsbin.com/tiqamaqamaqe/3/edit?html,js,output).

The Order of Events
------

There are four scenarios we need to detect and cover:
1. A touch device (iPhone, iPad, etc)
2. A non-touch device (Macbook)
3. A hybrid device user using the cursor
4. A hybrid device user using the touchscreen

<p class="endnote">For now we'll assume the user won't go between cursor and touch on a hybrid device.</p>

W3C recommendations are often hard or boring to read but in this case the [Touch Events Specification](http://www.w3.org/TR/touch-events/#mouse-events) will be our friend. Here's the low down:

On the `touchstart` event:

<blockquote>
<p>A user agent must dispatch this event type [<code>touchstart</code>] to indicate when the user places a touch point on the touch surface.</p>
<footer>'Touch Events', W3C, 10 Oct. 2013.</footer>
</blockquote>

On the subject of 'interaction with mouse events':

<blockquote>
<p>The user agent may dispatch both touch events and mouse events [DOM-LEVEL-2-EVENTS] in response to the same user input.</p>

<p>If the user agent dispatches both touch events and mouse events in response to a single user action, then the <code>touchstart</code> event type must be dispatched before any mouse event types for that action.</p>
<footer>'Touch Events', W3C, 10 Oct. 2013.</footer>
</blockquote>

So, in theory, a touch device will fire `touchstart` before `mousemove` or `mousedown` whereas a touchscreen laptop being used via a cursor will just fire the `mousemove` or `mousedown` event.

So, let's look at our four scenarios to see whether the pattern of events will be unique:

1. Touch: `touchstart` then `mousemove`
2. Non-touch: `mousemove`
3. Hybrid using cursor: `mousemove`
4. Hybrid using touch: `touchstart` then `mousemove`

Thus by looking at the order of the fired events (not just the type of events fired) we can decide whether or not to serve a touch experience.

A Solution
------

The following solution is Ember-based, but you can use the method in any framework and set the properties on the `window` or another object.

```
App.ApplicationView = Em.View.extend({
  touchExperience: false,

  setExperienceType: function() {
    // Detect type of interaction here
  }.on('didInsertElement'),
});
```

First, we're going to set up our application view with a boolean property representing touch and a method we'll use to detect how the user is using their device.

To detect the events we will bind event listeners to the `window`. Event listeners can severly hamper page performance so we must remove the listeners from the `window` once they have served their purpose. And we don't need to add the listeners if no touch events are supported because our `touchExperience` property defaults to false.

As such, let's wrap our first function in an `if` statement that detects touch event support:

```
App.ApplicationView = Em.View.extend({
  touchExperience: false,

  setExperienceType: function() {
    var _this = this;

    if (Modernizr.touch) {
      _this.set('touchExperience', true);

      var onMouseMove = function() {
        window.removeEventListener('mousemove', onMouseMove);
        _this.set('touchExperience', false);
      };
    }
  }.on('didInsertElement'),
});
```

Now we bind our `onMouseMove` method to the `mousemove` event using an event listener:

```
App.ApplicationView = Em.View.extend({
  touchExperience: false,

  setExperienceType: function() {
    var _this = this;

    if (Modernizr.touch) {
      _this.set('touchExperience', true);

      var onMouseMove = function() {
        window.removeEventListener('mousemove', onMouseMove);
        _this.set('touchExperience', false);
      };

      window.addEventListener('mousemove', onMouseMove);
    }
  }.on('didInsertElement'),
});
```

And now for the clever bit... Because we know `touchstart` will be fired before `mousemove` we can remove the `mousemove` event listener from the `window` when a touch event occurs:

```
App.ApplicationView = Em.View.extend({
  touchExperience: false,

  setExperienceType: function() {
    var _this = this;

    if (Modernizr.touch) { // 1.
      _this.set('touchExperience', true); // 2.

      var onMouseMove = function() {
        window.removeEventListener('mousemove', onMouseMove);

        _this.set('touchExperience', false);
      };

      var onTouchStart = function() {
        window.removeEventListener('mousemove', onMouseMove);
        window.removeEventListener('touchstart', onTouchStart);

        _this.set('touchExperience', true);
      };

      window.addEventListener('touchstart', onTouchStart); // 3.
      window.addEventListener('mousemove', onMouseMove); // 4.
    }
  }.on('didInsertElement'),
});
```
[Here is a working JS Bin](http://emberjs.jsbin.com/tiqamaqamaqe/3/edit?html,js,output).

So Why Does This Work?
------

With regards to the `touchExperience` property:

1. If no touch support is detected, there's no touch screen and we default to `false`.
2. If touch event support is detected, we set a preliminary value of `true` but don't assume one way or another.
3. If the `touchstart` event is fired (before scrolling, clicking, etc) we know the user is using a touch screen and **confirm** `touchExperience` is `true`. End of detection.
4. If `touchstart` does not occur before some kind of mouse event then the user is using a cursor and we reset `touchExperience` to false. End of detection.

Assumptions Made
------

- All user agents act in accordance with the [Touch Events Specification](http://www.w3.org/TR/touch-events/#mouse-events)
- `Modernizr.touch` is a reasonable guess for the type event that will occur first

Wrapping Up
------

Do you think this is a current solution to the touch detection issue? If you have implemented a solution this, has it failed on edge cases?

[Here is a working JS Bin](http://emberjs.jsbin.com/tiqamaqamaqe/3/edit?html,js,output).

---

Further Reading
------

- [The iOS event cascade](http://www.quirksmode.org/blog/archives/2014/02/the_ios_event_c.html)
- [W3C Touch Events Specification](http://www.w3.org/TR/touch-events/#mouse-events)
