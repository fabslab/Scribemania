var restify = require('restify');

var apiClient = restify.createJsonClient({
  url: 'https://localhost:8080'
});

module.exports = function(params) {
  var app = params.app;

  app.get('/stories/:slug', story);
};

function story(req, res) {
  var slug = req.params.slug;

  apiClient.get('/stories/' + slug, function(err, cReq, cRes, story) {
    res.render('story', { story: story });
  });
}