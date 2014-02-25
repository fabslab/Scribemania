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
    res.render('story', { story: story });
  });
}
