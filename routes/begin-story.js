var apiClient
  , sockets;

module.exports = function(app, api, passport, primus) {
  apiClient = api;
  sockets = primus.channel('stories');

  app.get('/new', newStoryForm);
  app.get('/starters/generate', generateStarter);
  app.post('/new', addStory);
};

function newStoryForm(req, res) {
  if (!req.user) res.redirect('/login');
  else {
    res.render('begin-story');
  }
}

function generateStarter(req, res, next) {
  apiClient.get('/starters/generate', function(err, cReq, cRes, storyStarter) {
    if (err) return next(err);
    res.json(storyStarter);
  });
}

function addStory(req, res, next) {
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

  if (req.body.genre.trim()) {
    story.genre = req.body.genre.trim();
  }

  apiClient.post('/stories', story, function(err, cReq, cRes, result) {
    if (err) return next(err);

    sockets.send('created', result);

    res.redirect('/stories/' + result.slug);
  });
}

