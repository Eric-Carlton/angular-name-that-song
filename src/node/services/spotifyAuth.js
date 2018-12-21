'use strict';

const privateConf = require('../conf/private.conf'),
  conf = require('../conf/app.conf'),
  request = require('request'),
  NodeCache = require('node-cache'),
  tokenCache = new NodeCache(conf.spotify.tokenCacheOpts),
  bunyan = require('bunyan'),
  log = bunyan.createLogger({
    name: 'spotifyAuth.js',
    level: conf.log.level
  });

class SpotifyAuth {
  constructor() {
    this.retrieveTokenPromise;
  }

  getToken(reqid) {
    log.debug(`Spotify token requested for ${reqid}`);

    const cachedToken = tokenCache.get(conf.spotify.tokenCacheKey);

    if (cachedToken) {
      log.debug(`returning cached Spotify token for ${reqid}`);
      return Promise.resolve(cachedToken);
    } else {
      if (!this.retrieveTokenPromise) {
        log.debug(`making request for spotify token for ${reqid}`);
        this.retrieveTokenPromise = this.call(
          this.getOptions(this.getHeaders(), this.getBody()),
          reqid
        );
      } else {
        log.debug(`waiting on spotify token response for ${reqid}`);
      }

      return this.retrieveTokenPromise;
    }
  }

  getHeaders() {
    return {
      Authorization:
        'Basic ' +
        new Buffer(
          privateConf.spotify.clientId + ':' + privateConf.spotify.clientSecret
        ).toString('base64')
    };
  }

  getBody() {
    return {
      grant_type: 'client_credentials'
    };
  }

  getOptions(headers, body) {
    return {
      url: conf.spotify.tokenEndpoint,
      method: 'POST',
      json: true,
      headers: headers,
      form: body
    };
  }

  call(options, reqid) {
    log.debug(`Making Spotify token request for ${reqid}`, options);

    this.retrieveTokenPromise = new Promise((resolve, reject) => {
      request(options, (err, res, body) => {
        this.mapper(err, res, body, resolve, reject, reqid);
      });
    });

    return this.retrieveTokenPromise;
  }

  mapper(err, res, body, resolve, reject, reqid) {
    this.retrieveTokenPromise = null;

    log.debug(
      `Spotify token response for ${reqid}`,
      { status: res ? res.statusCode : undefined },
      { res: body }
    );

    if (!err && res.statusCode === 200 && body.access_token) {
      const token = `Bearer ${body.access_token}`;

      tokenCache.set(conf.spotify.tokenCacheKey, token);
      resolve(token);
    } else {
      log.error(`Error retrieving Spotify token for ${reqid}`, err, body);
      reject(new Error('Unable to get Spotify token'));
    }
  }
}

module.exports = new SpotifyAuth();
