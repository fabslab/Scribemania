var apiClient;

module.exports = function(app, api) {
  apiClient = api;

  app.get('/stories/:slug', story);
};

function story(req, res) {
  var slug = req.params.slug;

  apiClient.get('/stories/' + slug, function(err, cReq, cRes, story) {
    res.render('story', { story: story });
  });
}