'use strict'

var connect    = require('connect');
var http       = require('http');
var node_env   = process.env.NODE_ENV || 'development';
var path       = require('path');
var public_dir = path.join(__dirname, 'production');
var rewrite    = require('connect-modrewrite');

var app = connect()
  .use(function(req, res, next) {
    if (node_env == 'production' && req.headers['x-forwarded-proto'] != 'https') {
      res.writeHead(301, {
       'Location':'https://'+req.headers.host+req.url
      });
      return res.end('Redirecting to SSL\n');
    } else {
      next();
    }
  })
  .use(rewrite(['^([^.]+)$ /index.html']))
  .use(connect.static(public_dir))

http.createServer(app).listen(process.env.PORT || 3333);
