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
  constructor(reqid) {
    this.reqid = reqid;
  }

  getToken() {
    log.debug(`Spotify token requested for ${this.reqid}`);

    const cachedToken = tokenCache.get(conf.spotify.tokenCacheKey);

    if (cachedToken) {
      log.debug(`returning cached Spotify token for ${this.reqid}`);
      return Promise.resolve(cachedToken);
    } else {
      return this.call(this.getOptions(this.getHeaders(), this.getBody()));
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

  call(options) {
    log.debug(`Making Spotify token request for ${this.reqid}`, options);

    return new Promise((resolve, reject) => {
      request(options, (err, res, body) => {
        this.mapper(err, res, body, resolve, reject);
      });
    });
  }

  mapper(err, res, body, resolve, reject) {
    log.debug(
      `Spotify token response for ${this.reqid}`,
      { status: res ? res.statusCode : undefined },
      { res: body }
    );

    if (!err && res.statusCode === 200 && body.access_token) {
      const token = `Bearer ${body.access_token}`;

      tokenCache.set(conf.spotify.tokenCacheKey, token);
      resolve(token);
    } else {
      log.error(`Error retrieving Spotify token for ${this.reqid}`, err, body);
      reject(new Error('Unable to get Spotify token'));
    }
  }
}

module.exports = SpotifyAuth;
