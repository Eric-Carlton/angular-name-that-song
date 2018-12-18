'use strict';

const express = require('express'),
  conf = require('../conf/app.conf'),
  requireDir = require('require-dir'),
  path = require('path'),
  bunyan = require('bunyan'),
  app = express(),
  log = bunyan.createLogger({
    name: 'createServer.js',
    level: conf.log.level
  });

module.exports = () => {
  const middleware = requireDir(conf.express.middlewarePath, {
      extensions: ['.js']
    }),
    routes = requireDir(conf.express.routesPath, { extensions: ['.js'] });

  // load middleware and add to app
  Object.keys(middleware)
    .map(key => {
      middleware[key].name = key;
      return middleware[key];
    })
    .sort((a, b) => a.priority - b.priority)
    .forEach(middleware => {
      log.debug(`adding ${middleware.name} middleware`);
      app.use(middleware.use);
    });

  // Point static path to dist
  app.use(express.static(path.join(__dirname, conf.express.staticFolder)));

  // load route handlers
  Object.keys(routes)
    .map(key => {
      routes[key].name = key;
      return routes[key];
    })
    .forEach(route => {
      const router = express.Router(),
        apiRoutesPrefix = conf.express.apiRoutesPrefix || '';

      route.handler(router);

      log.debug(
        `Adding route ${route.name} at path ${apiRoutesPrefix}${route.path}`
      );

      app.use(`${apiRoutesPrefix}${route.path}`, router);
    });

  // Catch all other routes and return the index file
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, conf.express.indexPath));
  });

  return app;
};
