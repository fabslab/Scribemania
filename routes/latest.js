var apiClient;

module.exports = function(app, api) {
  apiClient = api;

  // home page is currently the same as the latest stories page
  app.get('/', latest);
  app.get('/latest', latest);
  app.get('/stories', latest);

};

function latest(req, res, next) {
  apiClient.get('/stories', function(err, cReq, cRes, stories) {
    if (err) return next(err);

    // provide data for whether a user has starred a story or not if userId is provided
    if (req.user) {
      var userId = req.user._id;
      stories.forEach(function(story) {
        story.starred = (story.starredBy.indexOf(userId) >= 0);
      });
    }

    res.render('latest', { stories: stories });
  });
}
