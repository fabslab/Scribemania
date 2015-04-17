var apiClient;

module.exports = function(app, api) {
  apiClient = api;

  app.get('/starred', getStarredStoriesByUser);
  app.post('/stories/:id/stars/:method', incrementStar);
};

function getStarredStoriesByUser(req, res, next) {
  if (!req.user) return res.redirect('/login');

  apiClient.get('/users/' + req.user.id + '/starred', function(err, cReq, cRes, stories) {
    if (err) return next(err);

    // attach flag for UI to display favorited status
    stories.forEach(function(story) {
      story.starred = true;
    });

    res.render('starred', { stories: stories });
  });
}

function incrementStar(req, res, next) {
  if (!req.user) return res.redirect('/login');

  var storyId = req.params.id;
  var method = req.params.method;
  var userId = req.user.id;

  if (method != 'create' && method != 'destroy') {
    return res.send(400);
  }

  var apiMethod = method == 'create' ? 'put' : 'del';

  apiClient[apiMethod]('/stories/' + storyId + '/stars/' + userId, function(err, cReq, cRes) {
    if (err) return next(err);
    res.send(cRes.statusCode);
  });
}