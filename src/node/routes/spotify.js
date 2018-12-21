'use strict';

const conf = require('../conf/app.conf'),
  SpotifySearchArtist = require('../services/spotifySearchArtist'),
  SpotifyArtistRecommendations = require('../services/spotifyArtistRecommendations'),
  bunyan = require('bunyan'),
  log = bunyan.createLogger({
    name: 'spotify.js',
    level: conf.log.level
  });

class SpotifyRoute {
  constructor(router) {
    router.get('/playlist/:artist', this.getSpotifyPlaylistForArtist);
  }

  getSpotifyPlaylistForArtist(req, res) {
    const searchArtistSrvc = new SpotifySearchArtist(req.headers.reqid);

    searchArtistSrvc
      .getIdForArtist(req.params.artist)
      .then(artistId => {
        if (artistId) {
          const recommendationsSrvc = new SpotifyArtistRecommendations(
            req.headers.reqid
          );

          return recommendationsSrvc.getRecommendationsForArtistId(artistId);
        } else {
          const e = new Error('No artist found');
          e.status = 404;

          throw e;
        }
      })
      .then(recommendations => {
        if (recommendations && recommendations.length > 0) {
          res.json(recommendations);
        } else {
          const e = new Error('No recommendations found');
          e.status = 404;

          throw e;
        }
      })
      .catch(e => {
        log.error(e);
        return res.status(e.status || 500).json({ error: e.message });
      });
  }
}

module.exports = {
  path: '/spotify',
  handler: router => new SpotifyRoute(router)
};
