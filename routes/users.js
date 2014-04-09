var apiClient;

module.exports = function(app, api) {
  apiClient = api;

  app.get('/users/:id', user);
};

function user(req, res, next) {
  var id = req.params.id;
  var url = '/users/' + id;

  apiClient.get(url, function(userErr, userReq, userRes, user) {
    if (userErr) return next(userErr);

    apiClient.get(url + '/stories', function(storiesErr, storiesReq, storiesRes, stories) {
      if (storiesErr) return next(storiesErr);

      res.render('user', { user: user, stories: stories });
    });
  });
}