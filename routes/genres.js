var stories
  , genres;

module.exports = function(params) {
  var app = params.app
    , db = params.db;

  stories = require('../api/stories.js')(db);
  genres = require('../api/genres.js')(db);

  app.get('/genres', genreSearchPage);
  app.get('/genres/:genre', genreSearchResults);
};

function genreSearchPage(req, res) {
  var genreQuery = req.query.genre;
  if (genreQuery && (genreQuery = genreQuery.trim())) {
    return getStoriesForGenre(res, genreQuery);
  }
  genres.getTop(function(err, topGenres) {
    res.render('genres', { genres: topGenres });
  });
}

function genreSearchResults(req, res) {
  var genre = req.params.genre;
  getStoriesForGenre(res, genre);
}

function getStoriesForGenre(res, genre) {
  stories.get({ genre: genre }, function(err, stories) {
    res.render('genres', { stories: stories });
  });
}