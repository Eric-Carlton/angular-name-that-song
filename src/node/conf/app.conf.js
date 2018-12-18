'use strict';

module.exports = {
  express: {
    port: 3000,
    middlewarePath: '../middleware',
    routesPath: '../routes',
    apiRoutesPrefix: '/api',
    staticFolder: '../../../dist',
    indexPath: '../../../dist/index.html'
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
