var stories;

module.exports = function(params) {

  stories = require('../data/stories.js')(params.db);
  var app = params.app;

  app.get('/new', newStoryForm);
  app.post('/new', addStory);

};

function newStoryForm(req, res) {
  res.render('add-story');
}

function addStory(req, res) {

  var story = {
    title: req.body.title,
    paragraphs: [{
      text: req.body.paragraph
    }]
  };

  stories.add(story, function(doc) {
    // TODO: broadcast the story (as a volatile socket message) to the Latest page and create an indicator on the page
    // of how many new stories have been added since user loaded them (like Twitter)
    res.redirect('/');
  });

}