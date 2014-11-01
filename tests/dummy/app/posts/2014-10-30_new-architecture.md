---
title: Decoupling our Rails-Ember Application
description: Our architecture has gone through drastic changes over the past year. Our current iteration features a decoupled client-server relationship. Using Rails strictly as an API and Node.js to serve up our frontend, we have seen massive improvements code organization and development speed.
published: 2014-10-31
author: Matt
categories:
 - ember
 - rails
---

##Rails Engines
After reading articles published by organizations like <a href="http://pivotallabs.com/migrating-from-a-single-rails-app-to-a-suite-of-rails-engines/">Pivotal Labs</a> and <a href="http://gaslight.co/blog/maintainable-and-scalable-systems-with-rails-engines">Gaslight</a>, we decided to consolidate our separate Rails-Ember projects into one monolithic app that would house all of our code.

This setup worked wonderfully at first. We could deploy with a simple ```git push``` and our sub-applications were separated via Rails engines. However, we started running into issues as our Ember projects grew. A simple page reload would take about 15 seconds due to the number of javascript files in a single project. We needed a new approach.

##New Approach

The first step we took was to decouple the apps.  Rails would act purely as an API and each Ember application would exist on its own Node server.  We scrapped the use of engines in our Rails API, moving all resources into namespaced modules. For the frontend, we decided to utilize HTML5 build tool (<a href="http://brunch.io/">Brunch!</a>) for our Ember applications.  This was decided before Ember CLI hit the market, but we still find Brunch to be a wholesome and effective tool for our purposes.

Along the way, we hit a few snags. Here is how we tackled them:

###Cross-Origin Resource Sharing (CORS)
To adhere to the CORS protocol, we added a small piece of middleware to Rack (<a href="http://www.rafekettler.com/blog/category/rack/">with the help of this tutorial</a>).

###Development Environment
Jebbit utilizes wildcard subdomains for our clients' campaigns, but this is not trivial to setup on a local environment. At first, we were using <a href="http://lvh.me">lvh.me</a> which points to <a href="#">127.0.0.1</a> and allows for wildcards, but this didn't quite fit our needs. It required us to use ports in the url, which was clunky.

Dnsmasq helped us out wildcard subdomains on our local environment and Nginx allowed us to map every server to different subdomains on port 80/443. If you want a more detailed explanation of this solution, shoot us an email at <a href="mailto:tech@jebbit.com">tech@jebbit.com</a> :D

###Deployment
Our code is still contained in one git repo, so we needed to work some git magic to deploy our projects. Subtrees have proven to be the best method for this. It's a fairly simple command to push an individual project:

```
git subtree split -P path/to/project -b branch-name && \
git push project-production branch-name:master
```

We automated this entire process with the help of our friends at <a href="https://codeship.io/">CodeShip</a>, which has made continuous integration a breeze.

By increasing the complexity of our architecture, we have set ourselves up for success in the long run. The decoupling of the front and backends gives us the ability to scale individual pieces of our product suite as needed. It also forced us to automate a lot of tedious processes (i.e. deployment), and has sped up development exponentially.
