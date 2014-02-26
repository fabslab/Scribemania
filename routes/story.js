var apiClient;

module.exports = function(app, api) {
  apiClient = api;

  app.get('/stories/:slug', story);
};

function story(req, res, next) {
  var slug = req.params.slug;

  apiClient.get('/stories/' + slug, function(err, cReq, cRes, story) {
    if (cRes.statusCode == 404) {
      return res.render('404');
    }
    if (err) return next(err);

    // provide data for whether a user has starred a story or not if userId is provided
    if (req.user) {
      var userId = req.user._id;
      story.starred = (story.starredBy.indexOf(userId) >= 0);
    }

    res.render('story', { story: story });
  });
}
