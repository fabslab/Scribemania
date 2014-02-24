var apiClient;

module.exports = function(app, api) {
  apiClient = api;

  app.get('/starred', getStarredStoriesByUser);
  app.post('/stories/:id/stars', incrementStar);
};

function getStarredStoriesByUser(req, res, next) {
  if (!req.user) res.redirect('/login');

  apiClient.get('/users/' + req.user._id + '/starred', function(err, cReq, cRes, stories) {
    if (err) return next(err);
    res.render('latest', { stories: stories });
  });
}

function incrementStar(req, res, next) {
  if (!req.user) res.redirect('/login');

  var storyId = req.params.id;

  apiClient.post('/stories/' + storyId + '/stars', { userId: req.user._id }, function(err, cReq, cRes) {
    if (err) return next(err);
    res.send(cRes.statusCode);
  });
}