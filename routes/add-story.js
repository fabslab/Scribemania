var stories
  , io;

module.exports = function(params) {

  stories = require('../data/stories.js')(params.db);
  io = params.socketIo;
  var app = params.app;

  app.get('/new', newStoryForm);
  app.post('/new', addStory);

};

function newStoryForm(req, res) {
  res.render('add-story');
}

function addStory(req, res) {
  var genres = req.body.genres.split(/,\s*/).map(function(genre) { return genre.toLowerCase(); });
  var paragraphText = req.body.paragraph;

  var story = {
    title: req.body.title,
    paragraphs: [{
      text: paragraphText
    }],
    genres: genres
  };

  stories.add(story, function(doc) {
    // set up server-sent events to update the Latest page each time a story is created and
    // display how many new stories have been added since user loaded them (like Twitter)
    res.redirect('/stories/' + doc._id);
  });
}