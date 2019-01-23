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
    router.get('/playlist/:artists', this.getSpotifyPlaylistForArtist);
  }

  getSpotifyPlaylistForArtist(req, res) {
    const artists = req.params.artists.split(','),
      searchArtistSrvc = new SpotifySearchArtist(req.headers.reqid),
      promises = [];

    if (artists.length > 5) {
      const e = new Error('Too many artists');
      e.status = 400;

      throw e;
    } else {
      artists.forEach(artist => {
        promises.push(searchArtistSrvc.getIdForArtist(artist.trim()));
      });
    }

    Promise.all(promises)
      .then(artistIdsArr => {
        log.debug(
          `All artists to query for recommendations for ${req.headers.reqid}`,
          artistIdsArr
        );

        // filter out any undefined artists
        artistIdsArr = artistIdsArr.filter(artistId => artistId);

        if (artistIdsArr && artistIdsArr.length > 0) {
          const recommendationsSrvc = new SpotifyArtistRecommendations(
              req.headers.reqid
            ),
            artistIds = artistIdsArr
              .filter(artist => artist && artist.length > 0)
              .join(',');

          log.debug(
            `Artists concatenated as string for ${req.headers.reqid}`,
            artistIds
          );

          return recommendationsSrvc.getRecommendationsForArtistId(artistIds);
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
