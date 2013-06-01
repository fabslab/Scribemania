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
  var story = {
    title: req.body.title,
    paragraphs: [{
      text: req.body.paragraph
    }]
  };

  stories.add(story, function(doc) {
    // set up server-sent events to update the Latest page each time a story is created and
    // display how many new stories have been added since user loaded them (like Twitter)
    res.redirect('/stories/' + doc._id);
  });
}