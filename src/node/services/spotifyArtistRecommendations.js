'use strict';

const conf = require('../conf/app.conf'),
  request = require('request'),
  jsonpath = require('jsonpath'),
  NodeCache = require('node-cache'),
  recommendationsCache = new NodeCache(conf.spotify.recommendationsCacheOpts),
  bunyan = require('bunyan'),
  log = bunyan.createLogger({
    name: 'spotifyArtistRecommendations.js',
    level: conf.log.level
  }),
  SpotifyAuth = require('./spotifyAuth');

class SpotifyArtistRecommendations {
  constructor(reqid) {
    this.reqid = reqid;
  }

  getRecommendationsForArtistId(artistId) {
    log.debug(`Spotify recommendations requested for ${this.reqid}`);

    const cacheKey = this.getCacheKey(artistId),
      cachedRecommendations = recommendationsCache.get(cacheKey);

    if (cachedRecommendations) {
      log.debug(`returning cached recommendations for ${this.reqid}`);
      return Promise.resolve(cachedRecommendations);
    } else {
      return this.call(
        this.getOptions(this.getHeaders(), this.getParams(artistId)),
        cacheKey
      );
    }
  }

  getCacheKey(artistId) {
    return `spotify-${artistId}-recommendations`;
  }

  getHeaders() {
    return {};
  }

  getParams(artistId) {
    return {
      seed_artists: artistId,
      limit: 100
    };
  }

  getOptions(headers, params) {
    return {
      url: conf.spotify.recommendationsEndpoint,
      method: 'GET',
      qs: params,
      headers: headers,
      json: true
    };
  }

  call(options, cacheKey) {
    log.debug(
      `Making Spotify recommendations request for ${this.reqid}`,
      options
    );

    return new Promise((resolve, reject) => {
      const authService = new SpotifyAuth(this.reqid);

      authService
        .getToken()
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
      `Spotify recommendations response for ${this.reqid}`,
      { status: res.statusCode },
      { res: body }
    );

    if (!err && res.statusCode === 200) {
      const tracks = jsonpath
        .query(body, '$.tracks')[0]
        .map(track => {
          log.trace(JSON.stringify(track, null, 2));
          return {
            artist: jsonpath.query(track, '$.artists..name')[0],
            name: jsonpath.query(track, '$.name')[0],
            previewUrl: jsonpath.query(track, '$.preview_url')[0],
            album: jsonpath.query(track, '$.album.name')[0],
            // medium sized art is always second in array
            albumArtUrl: jsonpath.query(track, '$.album.images[1]')[0].url
          };
        })
        .filter(track => track.previewUrl);

      if (tracks.length > 0) {
        recommendationsCache.set(cacheKey, tracks);
      }

      resolve(tracks);
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

module.exports = SpotifyArtistRecommendations;
