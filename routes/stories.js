var apiClient, sockets;

module.exports = function(app, api, passport, primus) {
  apiClient = api;
  sockets = primus.channel('stories');

  app.get('/stories', renderStories);
  app.post('/stories', createStory);

  app.get('/stories/:slug', renderStory);

  app.get('/new', newStoryForm);
};

function renderStories(req, res, next) {
  apiClient.get('/stories', function(err, cReq, cRes, stories) {
    if (err) return next(err);

    // provide data for whether a user has starred a story or not if userId is provided
    if (req.user) {
      var userId = req.user._id;
      stories.forEach(function(story) {
        story.starred = (story.starredBy.indexOf(userId) >= 0);
      });
    }

    res.render('latest', { stories: stories });
  });
}

function createStory(req, res, next) {
  if (!req.user) res.redirect('/login');

  var story = {
    title: req.body.title,
    creatorId: req.user._id,
    creatorName: req.user.displayName,
    paragraphs: [{
      text: req.body.paragraph,
      authorId: req.user._id,
      authorName: req.user.displayName
    }]
  };

  var groupId = req.body.group;
  if (groupId && groupId.trim()) {
    story.groupId = groupId;
  }

  if (typeof req.body.genre == 'string') {
    story.genre = req.body.genre.trim().replace(' ', '-');
  }

  apiClient.post('/stories', story, function(err, cReq, cRes, result) {
    if (err) return next(err);

    sockets.send('created', result);

    res.redirect('/stories/' + result.slug);
  });
}

function renderStory(req, res, next) {
  var slug = req.params.slug;
  slug = encodeURIComponent(slug);

  apiClient.get('/stories/' + slug, function(err, cReq, cRes, story) {
    if (cRes.statusCode == 404) {
      return res.render('404');
    }
    if (err) return next(err);

    // provide data for whether a user has starred a story or not if userId is provided
    if (req.user) {
      var userId = req.user._id;
      story.starred = (story.starredBy.indexOf(userId) >= 0);
    }

    res.render('story', { story: story });
  });
}

function newStoryForm(req, res, next) {
  if (!req.user) return res.redirect('/login');

  var url = '/users/' + req.user._id + '/groups';

  apiClient.get(url, function(err, userReq, userRes, groups) {
    if (err) return next(err);

    res.render('begin-story', { groups: groups });
  });
}
