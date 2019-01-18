'use strict';

const bunyan = require('bunyan'),
  log = bunyan.createLogger({
    name: 'app.conf.js',
    level: 'info'
  });

let privateConf;

try {
  privateConf = require('./private.conf');
  log.info('Using private conf');
} catch (e) {
  log.info('No private conf found');
}

module.exports = {
  express: {
    port: process.env.PORT || 3000,
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
    level: process.env.LOG_LEVEL || 'trace'
  },
  spotify: {
    clientId: privateConf
      ? privateConf.spotify.clientId
      : process.env.SPOTIFY_CLIENT_ID,
    clientSecret: privateConf
      ? privateConf.spotify.clientSecret
      : process.env.SPOTIFY_CLIENT_SECRET,
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
