var apiClient;

module.exports = function(app, api) {
  apiClient = api;

  app.get('/starred', getUserStarred);
};

function getUserStarred(req, res) {
  if (!req.user) res.redirect('/login');
  res.end('Not implemented.');
}