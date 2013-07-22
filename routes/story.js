var stories;

module.exports = function(params) {
  stories = require('../data/stories.js')(params.db);
  var app = params.app;

  app.get('/stories/:slug', story);
};

function story(req, res) {
  var slug = req.params.slug;

  stories.getBySlug(slug, function(err, story) {
    res.render('story', { story: story });
  });
}