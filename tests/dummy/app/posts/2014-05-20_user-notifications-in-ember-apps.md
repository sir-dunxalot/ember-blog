---
title: User Notifications in Ember Apps
description: We've built a small notification library that allows you to you show an alert to the user from anywhere in your app with a single call. Check out the code and add alerts to your app with our simple plugin.
published: 2014-05-20
author: Jebbit
categories:
 - ember
---

{{#alert 'info'}}
  This post is out-of-date. You can find an {{#link-to 'post' 'notify'}}updated post here{{/link-to}}.
{{/alert}}

[Notify](https://github.com/sir-dunxalot/notify/blob/master/notify.js) is a small notification library (1.8kb) that integrates with any Ember app to queue and display notifications to the user.

Example use cases include showing the user a server error or showing a success message after saving some data.

Usage is simple:

```js
// Em.notify(type, message);
Em.notify('warning', 'Uh oh, you have no money left in your account');
```

This method is made available everywhere in your app (routes, views, inline scripts, etc). To display the notifications to the user, place a handlebars helper anywhere in your template(s):

```handlebars
{{notify}}
```

Notifications persist through route transitions and, therefore, you do not have to place `{{notify}}` in the application template - it will function correctly in route-specific templates too.

By default, notifications will be shown for 3 seconds before the next notification is made visible. Only one notification will be shown at a time.

<a href="https://github.com/sir-dunxalot/notify" target="_blank">See the full code here</a>. Integration with your app is as simple as copying and pasting the plugin file.

<p class="endnote">P.S. Styling is left up to you, but a basic css file is included in the repo.</p>
