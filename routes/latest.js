var apiClient;

module.exports = function(app, api) {
  apiClient = api;

  // home page is currently the same as the latest stories page
  app.get('/', latest);
  app.get('/latest', latest);

};

function latest(req, res) {
  apiClient.get('/stories', function(err, cReq, cRes, stories) {
    res.render('latest', { stories: stories });
  });
}