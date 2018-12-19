'use strict';

const SpotifySearchArtist = require('../services/spotifySearchArtist'),
  SpotifyArtistRecommendations = require('../services/spotifyArtistRecommendations');

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
          res.sendStatus(404);
        }
      })
      .then(recommendations => {
        if (recommendations && recommendations.length > 0) {
          res.json(recommendations);
        } else {
          res.sendStatus(404);
        }
      })
      .catch(e => res.status(500).json({ error: e.message }));
  }
}

module.exports = {
  path: '/spotify',
  handler: router => new SpotifyRoute(router)
};
