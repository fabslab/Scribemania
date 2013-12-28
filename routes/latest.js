var restify = require('restify');

var apiClient = restify.createJsonClient({
  url: 'https://localhost:8080'
});

module.exports = function(params) {
  var app = params.app;

  // home page is currently the same as the latest stories page
  app.get('/', latest);
  app.get('/latest', latest);

};

function latest(req, res) {
  apiClient.get('/stories', function(err, cReq, cRes, stories) {
    res.render('latest', { stories: stories });
  });
}