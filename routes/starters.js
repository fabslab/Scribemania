var apiClient;

module.exports = function(app, api) {
  apiClient = api;

  app.get('/starters/generate', generateStarter);
};

function generateStarter(req, res, next) {
  if (!req.user) res.send(403);

  apiClient.get('/starters/generate', function(err, cReq, cRes, storyStarter) {
    if (err) return next(err);

    res.json(storyStarter);
  });
}
