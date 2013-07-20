var stories;

module.exports = function(params) {
  stories = require('../data/stories.js')(params.db);
  var app = params.app;

  app.get('/genres/:genre', genres);
};

function genres(req, res) {
  var genre = req.params.genre;
  stories.get({ genre: genre }, function(err, stories) {
    res.render('latest', { stories: stories });
  });
}