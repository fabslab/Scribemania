var apiClient;

module.exports = function(app, api) {
  apiClient = api;

  app.get('/users/:username', user);
};

function user(req, res) {
  res.render('user');
}