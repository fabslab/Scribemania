var stories;

module.exports = function(params) {
  stories = require('../data/stories.js')(params.db);
  var app = params.app;

  app.get('/genres', genres);
};

function genres(req, res) {
  res.render('genres');
}