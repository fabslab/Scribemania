var apiClient;

module.exports = function(app, api) {
  apiClient = api;

  app.get('/groups', getUserGroups);
};

function getUserGroups(req, res) {
  if (!req.user) res.redirect('/login');
  res.end('Not implemented.');
}