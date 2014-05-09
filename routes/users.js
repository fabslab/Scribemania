var apiClient;

module.exports = function(app, api) {
  apiClient = api;

  app.get('/users', getUsers);

  app.get('/users/:id', renderUserProfile);
};

function getUsers(req, res, next) {
  var substring = req.query.q;

  // ensure the substring is not empty and contains only letters and spaces
  if (typeof substring != 'string' || !(substring = substring.trim()) || !/^[A-Z ]+$/i.test(substring)) {
    return res.send(400);
  }

  substring = encodeURIComponent(substring);

  apiClient.get('/users?substring=' + substring, function sendUsers(usersErr, usersReq, usersRes, users) {
    if (usersErr) return next(usersErr);

    res.send(users);
  });
}

function renderUserProfile(req, res, next) {
  var id = req.params.id;
  var url = '/users/' + id;

  apiClient.get(url, function(userErr, userReq, userRes, user) {
    if (userErr) return next(userErr);

    apiClient.get(url + '/stories', function renderView(storiesErr, storiesReq, storiesRes, stories) {
      if (storiesErr) return next(storiesErr);

      res.render('user', { profileUser: user, stories: stories });
    });
  });
}
