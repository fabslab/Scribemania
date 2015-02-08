var apiClient;

module.exports = function(app, api) {
  apiClient = api;

  app.get('/groups', renderCreateGroupsPage);
  app.post('/groups', createGroup);

  app.get('/groups/:slug', renderGroupPage);
};

function renderCreateGroupsPage(req, res, next) {
  if (!req.user) res.redirect('/login');

  apiClient.get('/users/' + req.user.id + '/groups', function(err, cReq, cRes, groups) {
    if (err) return next(err);
    res.render('groups', { groups: groups });
  });
}

function createGroup(req, res, next) {
  if (!req.user) res.redirect('/login');

  var group = {
    name: req.body.name,
    description: req.body.description,
    creatorId: req.user.id,
    writePrivate: req.body['write-access'] == 'private',
    members: req.body.members.split(',')
  };

  // add creator to list of people
  group.members.unshift(group.creatorId);

  apiClient.post('/groups', group, function(err, cReq, cRes, result) {
    if (err) return next(err);
    res.redirect('/groups/' + result.slug);
  });
}

function renderGroupPage(req, res, next) {
  var slug = req.params.slug;

  apiClient.get('/groups/' + slug, function(err, cReq, cRes, result) {
    if (err) return next(err);

    res.render('group-stories', {
      groupName: result.group.name,
      stories: result.stories
    });
  });
}