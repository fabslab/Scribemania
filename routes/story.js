var apiClient;

module.exports = function(params) {
  var app = params.app;
  apiClient = params.apiClient;
  
  app.get('/stories/:slug', story);
};

function story(req, res) {
  var slug = req.params.slug;

  apiClient.get('/stories/' + slug, function(err, cReq, cRes, story) {
    res.render('story', { story: story });
  });
}