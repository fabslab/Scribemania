var apiClient;

module.exports = function(app, api) {
  apiClient = api;

  app.get('/new', newStoryForm);
  app.post('/new', addStory);
};

function newStoryForm(req, res) {
  if (!req.user) res.redirect('/login');
  else {
    res.render('begin-story');
  }
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
    // TODO: set up socket listener to update the Latest page each time a story is created
    // and display how many new stories have been added since user loaded them (like Twitter)
    res.redirect('/stories/' + result.slug);
  });
}