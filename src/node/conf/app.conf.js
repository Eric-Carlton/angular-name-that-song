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
  },
  spotify: {
    tokenCacheOpts: {
      stdTTL: 3550
    },
    artistCacheOpts: {
      stdTTL: 3600
    },
    recommendationsCacheOpts: {
      standardTTL: 1800
    },
    tokenEndpoint: 'https://accounts.spotify.com/api/token',
    tokenCacheKey: 'token',
    searchEndpoint: 'https://api.spotify.com/v1/search',
    recommendationsEndpoint: 'https://api.spotify.com/v1/recommendations'
  }
};
