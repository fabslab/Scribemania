var storiesAccess;

module.exports = function(params) {
  storiesAccess = require('../data/stories.js')(params.db);
  var app = params.app;

  app.get('/new', newStoryForm);

  app.post('/new', addStory);
};

function newStoryForm(req, res) {
  res.render('add-story');
}

function addStory(req, res) {
  console.log(req.readable);
  var paragraph = {
    text: req.body.paragraph
  };
  var story = {
    title: req.body.title,
    paragraphs: [paragraph]
  };

  storiesAccess.add(story, function(doc) {
    res.redirect('/');
  });
}