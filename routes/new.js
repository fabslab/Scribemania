var apiClient;

module.exports = function(params) {
  var app = params.app;
  apiClient = params.apiClient;

  app.get('/new', newStoryForm);
  app.post('/new', addStory);
};

function newStoryForm(req, res) {
  if (!req.user) res.redirect('/login');
  else {
    res.locals._csrf = req.session._csrf;
    res.render('new');
  }
}

function addStory(req, res) {

  var story = {
    title: req.body.title,
    creator: req.user.username,
    paragraphs: [{
      text: req.body.paragraph,
      author: req.user.username
    }]
  };

  if (req.body.genre.trim()) {
    story.genre = req.body.genre.trim();
  }

  apiClient.post(story, function(err, cReq, cRes, result) {
    // TODO: set up socket listener to update the Latest page each time a story is created
    // and display how many new stories have been added since user loaded them (like Twitter)
    res.redirect('/stories/' + result.slug);
  });
}