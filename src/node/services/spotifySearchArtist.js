'use strict';

const conf = require('../conf/app.conf'),
  request = require('request'),
  jsonpath = require('jsonpath'),
  NodeCache = require('node-cache'),
  artistCache = new NodeCache(conf.spotify.artistCacheOpts),
  bunyan = require('bunyan'),
  log = bunyan.createLogger({
    name: 'spotifySearchArtist.js',
    level: conf.log.level
  }),
  authService = require('./spotifyAuth');

class SpotifySearchArtist {
  constructor(reqid) {
    this.reqid = reqid;
  }

  getIdForArtist(artist) {
    log.debug(`Spotify artist ID requested for ${this.reqid}`);

    const cacheKey = this.getCacheKey(artist),
      cachedArtistId = artistCache.get(cacheKey);

    if (cachedArtistId) {
      log.debug(`returning cached Spotify artist ID for ${this.reqid}`);
      return Promise.resolve(cachedArtistId);
    } else {
      return this.call(
        this.getOptions(this.getHeaders(), this.getParams(artist)),
        cacheKey
      );
    }
  }

  getCacheKey(artist) {
    return `spotify-${artist}-id`;
  }

  getHeaders() {
    return {};
  }

  getParams(artist) {
    return {
      q: artist,
      type: 'artist'
    };
  }

  getOptions(headers, params) {
    return {
      url: conf.spotify.searchEndpoint,
      method: 'GET',
      qs: params,
      headers: headers,
      json: true
    };
  }

  call(options, cacheKey) {
    log.debug(
      `Making Spotify artist search request for ${this.reqid}`,
      options
    );

    return new Promise((resolve, reject) => {
      authService
        .getToken(this.reqid)
        .then(authHeader => {
          options.headers['Authorization'] = authHeader;

          request(options, (err, res, body) => {
            this.mapper(err, res, body, resolve, reject, cacheKey);
          });
        })
        .catch(e => reject(e));
    });
  }

  mapper(err, res, body, resolve, reject, cacheKey) {
    log.debug(
      `Spotify artist search response for ${this.reqid}`,
      { status: res ? res.statusCode : undefined },
      { res: body }
    );

    if (!err && res.statusCode === 200) {
      const artistId = jsonpath.query(body, '$.artists.items.*.id')[0];

      if (artistId) {
        artistCache.set(cacheKey, artistId);
      }

      resolve(artistId);
    } else {
      log.error(
        `Error retrieving Spotify artist id for ${this.reqid}`,
        err,
        body
      );
      reject(new Error('Unable to get Spotify artist id'));
    }
  }
}

module.exports = SpotifySearchArtist;
