var stories;

module.exports = function(params) {
  stories = require('../data/stories.js')(params.db);
  var app = params.app;

  app.get('/stories/:id', story);
};

function story(req, res) {
  var objectIdRegExp = /^[0-9a-fA-F]{24}$/;
  if (!objectIdRegExp.test(req.params.id)) res.send(404);

  stories.getById(req.params.id, function(err, doc) {
    res.render('story', { story: doc });
  });
}