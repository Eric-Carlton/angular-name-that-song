'use strict';

module.exports = {
  express: {
    port: 3000,
    middlewarePath: 'middleware',
    routesPath: 'routes',
    apiRoutesPrefix: '/api',
    static: {
      folder: '../../dist',
      index: 'index.html'
    }
  },
  cors: {
    allowedOrigins: [''],
    exposedHeaders: ['reqid'],
    allowedHeaders: ['content-type'],
    allowedMethods: ['GET'],
    credentials: false
  },
  csurf: { cookie: true },
  log: {
    level: 'trace'
  }
};
