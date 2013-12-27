var stories;

module.exports = function(params) {
  var app = params.app;
  stories = require('../api/stories.js')(params.db);

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

  stories.add(story, function(err, story) {
    // TODO: set up server-sent events to update the Latest page each time a story is created
    // and display how many new stories have been added since user loaded them (like Twitter)
    res.redirect('/stories/' + story.slug);
  });
}