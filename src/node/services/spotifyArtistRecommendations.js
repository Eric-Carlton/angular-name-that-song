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
  authService = require('./spotifyAuth');

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
      limit: 100,
      // filter out all instrumental tracks
      max_instrumentalness: 0.35
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
      `Spotify recommendations response for ${this.reqid}`,
      { status: res ? res.statusCode : undefined },
      { res: body }
    );

    try {
      if (!err && res.statusCode === 200) {
        const tracks = jsonpath
          .query(body, '$.tracks')[0]
          .map(track => {
            return {
              artist: jsonpath.query(track, '$.artists..name')[0],
              name: jsonpath.query(track, '$.name')[0],
              previewUrl: jsonpath.query(track, '$.preview_url')[0],
              album: jsonpath.query(track, '$.album.name')[0],
              // medium sized art is always second in array
              albumArtUrl: jsonpath.query(track, '$.album.images[1].url')[0],
              songUrl: jsonpath.query(track, '$.external_urls.spotify')[0]
            };
          })
          .filter(track => track.artist && track.name && track.previewUrl);

        if (tracks.length > 0) {
          recommendationsCache.set(cacheKey, tracks);
        }

        log.debug(
          `Spotify recommendations response for ${this.reqid} mapped`,
          tracks
        );

        resolve(tracks);
      } else {
        log.error(
          `Error retrieving Spotify recommendations for ${this.reqid}`,
          err,
          body
        );
        reject(new Error('Unable to get Spotify recommendations'));
      }
    } catch (e) {
      log.error(
        `Error mapping Spotify recommendations for ${this.reqid}`,
        err,
        body
      );
      reject(new Error('Unable to get Spotify recommendations'));
    }
  }
}

module.exports = SpotifyArtistRecommendations;
